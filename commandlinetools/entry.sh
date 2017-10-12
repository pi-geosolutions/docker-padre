#!/usr/bin/env bash

set -e

[ "$DEBUG" == 'true' ] && set -x

DAEMON=sshd

# We run sshd using supervisord, hence not using init.d, so we apprently need to make this directory
# see https://bugs.launchpad.net/ubuntu/+source/openssh/+bug/45234
# or we would get a 'Missing privilege separation directory: /var/run/sshd' error
[ -d /var/run/sshd ] || mkdir /var/run/sshd

# Copy default config from cache
if [ ! "$(ls -A /etc/ssh)" ]; then
   cp -a /etc/ssh.cache/* /etc/ssh/
fi

# Generate Host keys, if required
if ! ls /etc/ssh/ssh_host_* 1> /dev/null 2>&1; then
    ssh-keygen -A
fi

# Fix permissions, if writable
if [ -w ~/.ssh ]; then
    chown root:root ~/.ssh && chmod 700 ~/.ssh/
fi
if [ -w ~/.ssh/authorized_keys ]; then
    chown root:root ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
fi
if [ -w /etc/authorized_keys ]; then
    chown root:root /etc/authorized_keys
    chmod 755 /etc/authorized_keys
    find /etc/authorized_keys/ -type f -exec chmod 644 {} \;
fi

#creates pgpass file so that user padre can connect without need to provide a password
echo  "pgis:5432:*:padre:padre" > /root/.pgpass
chmod 0600 /root/.pgpass


# Add users if SSH_USERS=user:uid:gid set
echo "SSH_USER: ${SSH_USERS}"
if [ -n "${SSH_USERS}" ]; then
    USERS=$(echo $SSH_USERS | tr "," "\n")
    for U in $USERS; do
        IFS=':' read -ra UA <<< "$U"
        _NAME=${UA[0]}
        _UID=${UA[1]}
        _GID=${UA[2]}

        echo ">> let's go"
        echo ">> Adding user ${_NAME} with uid: ${_UID}, gid: ${_GID}."
        if [ ! -e "/etc/authorized_keys/${_NAME}" ]; then
            echo "WARNING: No SSH authorized_keys found for ${_NAME}!"
        fi
#        addgroup --gid ${_GID} ${_NAME}
#        adduser --shell /bin/bash --uid ${_UID} --gid ${_GID} --disabled-password ${_NAME}

		if getent group ${_NAME} | grep &>/dev/null "${_NAME}"; then
			echo "Group ${_NAME} already exists. Skipping user creation"
		else
			groupadd --gid ${_GID} ${_NAME}
			useradd --gid ${_GID} --create-home --shell '/bin/bash' --uid ${_UID} ${_NAME}
			echo ">> group & user created"
		fi
    done
else
    # Warn if no authorized_keys
    if [ ! -e ~/.ssh/authorized_keys ] && [ ! $(ls -A /etc/authorized_keys) ]; then
      echo "WARNING: No SSH authorized_keys found!"
    fi
fi

#fix directory permission for crontab, in case we use a host-mounted folder (permissions are then not set correctly)
chown root:crontab /var/spool/cron/crontabs/
chmod 731 /var/spool/cron/crontabs
chmod o+t /var/spool/cron/crontabs

# Update MOTD
if [ -v MOTD ]; then
    echo -e "$MOTD" > /etc/motd
fi

#coloration syntaxique pour root
echo "set bg=dark" > /root/.vimrc

stop() {
    echo "Received SIGINT or SIGTERM. Shutting down $DAEMON"
    # Get PID
    pid=$(cat /var/run/$DAEMON/$DAEMON.pid)
    # Set TERM
    kill -SIGTERM "${pid}"
    # Wait for exit
    wait "${pid}"
    # All done.
    echo "Done."
}

echo "Running $@"
if [ "$(basename $1)" == "$DAEMON" ]; then
    trap stop SIGINT SIGTERM
    $@ &
    pid="$!"
    mkdir -p /var/run/$DAEMON && echo "${pid}" > /var/run/$DAEMON/$DAEMON.pid
    wait "${pid}" && exit $?
else
    exec "$@"
fi
