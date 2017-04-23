# SSHD

Ubuntu Docker container with `sshd` exposed and `rsync` installed.

Provides also several GIS & more general utilities : GDAL, Python + geospatial & statistics extensions, etc

*Mostly inspired from [[https://github.com/macropin/docker-sshd]]*

Mount your .ssh credentials (RSA public keys) at `/root/.ssh/` in order to
access the container via root ssh or mount each user's key in
`/etc/authorized_keys/<username>` and set `SSH_USERS` config to create user accounts (see below).

Optionally mount a custom sshd config at `/etc/ssh/`.

## Environment Options

- `SSH_USERS` list of user accounts and uids/gids to create. eg `SSH_USERS=www:48:48,admin:1000:1000`
- `MOTD` change the login message

## Usage Example

```
docker run -d -p 2222:22 -v /secrets/id_rsa.pub:/root/.ssh/authorized_keys -v /mnt/data/:/data/ jeanpommier/padre1-sshd
```

or

```
docker run -d -p 2222:22 -v $(pwd)/id_rsa.pub:/etc/authorized_keys/www -e SSH_USERS="www:48:48" jeanpommier/padre1-sshd
```

