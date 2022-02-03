#!/bin/sh
REPO="/worrlo/node-examples.git"
ORIGIN=`git config --get remote.origin.url`

if [ ".$ORIGIN" != "." ]; then
    echo "removing origin"
    git remote remove origin
fi
echo "setup https://`cat .ghp`@github.com$REPO"
git remote add origin https://`cat .ghp`@github.com$REPO