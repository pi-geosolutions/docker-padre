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

#create pigeo user, that will be used mostly as a wildcard user for folders belonging to pigeo group (common to all users)
groupadd --gid 2000 pigeo
useradd --gid pigeo --create-home --shell '/bin/bash' --uid 2000 pigeo

echo "users support status : $PIGEO_USERS_SUPPORT"
if [ "$PIGEO_USERS_SUPPORT" = 'true' ]; then
    echo "creating group pigeo-users"
    # also create pigeo-users group for the same reason, but intended for less priviledged users (national users)
    groupadd --gid 2001 pigeo-users
    # create geoserver_data subfolder for them
    mkdir -p /padre/geoserver_data/data/pays/${GEOSERVER_NS}/users/
    chown pigeo:pigeo-users /padre/geoserver_data/data/pays/${GEOSERVER_NS}/users/
    chmod 775 /padre/geoserver_data/data/pays/${GEOSERVER_NS}/users/
    chmod g+s /padre/geoserver_data/data/pays/${GEOSERVER_NS}/users/
fi

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

        if getent group ${_GID} | grep &>/dev/null "${_GID}"; then
			    echo "Group ${_NAME} already exists. Skipping group creation"
		else
          groupadd --gid ${_GID} ${_NAME}
        fi

	    if id "${_NAME}" > /dev/null 2>&1; then
		    echo "User ${_NAME} already exists. Skipping user creation"
	    else
          #if gid is pigeo's then main group for user will be pigeo
          #else it won't belong to pigeo, and thus not have access to pigeo folders
		    useradd --gid ${_GID} -G www-data --create-home --shell '/bin/bash' --uid ${_UID} ${_NAME}
		    echo ">> group & user created"
	    fi

        if [ "$PIGEO_USERS_SUPPORT" = 'true' ]; then
            # Always add user to pigeo-users
            usermod -a -G pigeo-users ${_NAME}
            # And if user's group is pigeo-users, we add a link to geoserver_data dir in their home folder
            if [ "$_GID" -eq "2001" ]; then
                if [ ! -e /home/${_NAME}/geoserver_data ]; then
                    ln -s /padre/geoserver_data/data/pays/${GEOSERVER_NS}/users/ /home/${_NAME}/geoserver_data
                fi
                # Set up ssh config : it will still be necessary to add the public key to authorized_keys
                mkdir -p /home/${_NAME}/.ssh
                chown ${_NAME}:${_GID} /home/${_NAME}/.ssh
                chmod 700 /home/${_NAME}/.ssh
                if [ ! -f /home/${_NAME}/.ssh/authorized_keys ]; then
                    touch  /home/${_NAME}/.ssh/authorized_keys
                    chown ${_NAME}:${_GID} /home/${_NAME}/.ssh/authorized_keys
                    chmod 600 /home/${_NAME}/.ssh/authorized_keys
                fi
            fi
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

#coloration syntaxique pour root
echo "set bg=dark" > /root/.vimrc
echo "syntax on" >> /root/.vimrc

#get a nice prompt with project name
echo "export PS1='\[\e]0;\u@\h: \w\a\]\${debian_chroot:+(\$debian_chroot)}\u@${PROJECTID}:\w\$'" >> /etc/profile

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
