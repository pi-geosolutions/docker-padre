#!/bin/bash -x

#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR=/home/jean/backups/rancher

#CLI="$DIR/rancher-cli/rancher"
CLI="/home/jean/bin/rancher-cli/rancher"

$CLI --version

#export RANCHER_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#export RANCHER_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#export RANCHER_URL=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/v2-beta


IFS=$'\n'

mkdir -p $DIR/backup
$CLI environment ls > $DIR/backup/environment.txt
 
for e in `cat $DIR/backup/environment.txt | tail -n +2 | tr -s ' ' | cut -f2 -d' '` ; do
 export RANCHER_ENVIRONMENT=$e
 echo "environment $e"
 mkdir -p $DIR/backup/$e

 cd $DIR/backup
 $CLI hosts ls > $e.hosts.txt

 echo -e "" > $e.volumes.txt
 for v in `$CLI volumes | grep rancher | tr -s ' ' ` ; do
  type=`echo $v | cut -f4 -d' '`
  mnt=`echo $v | cut -f2 -d' '`
  if [[ $type == "rancher-"* ]] ; then 
   echo "$type $mnt" >> $e.volumes.txt 
  fi
 done;

 cd $DIR/backup/$e
 $CLI export
done;
