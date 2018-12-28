#!/bin/bash
host='140.114.212.43'
username='linaro'

cat ./.bin/script.sh | ssh $username@$host
