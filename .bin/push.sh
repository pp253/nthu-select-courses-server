#!/bin/bash
host='140.114.212.43'
username='linaro'

sftp $username@$host < ./.bin/script-ftp.sh

cat ./.bin/script.sh | ssh $username@$host

echo "Connecting to $host via sftp."
