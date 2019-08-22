#!/bin/bash
host='nthu-courses.duckdns.org'
username='linaro'

sftp $username@$host < ./.bin/script-ftp.sh

cat ./.bin/script.sh | ssh $username@$host

echo "Connecting to $host via sftp."
