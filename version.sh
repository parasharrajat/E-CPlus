#! /bin/bash

version=$(grep version package.json | awk -F \" '{print $4}');

sed -i "s/\"version\": \"[0-9\.]*/\"version\": \"$version/g" app/manifest.json

git commit -am "New version $version"

git tag -a v$version -m "New version $version"
