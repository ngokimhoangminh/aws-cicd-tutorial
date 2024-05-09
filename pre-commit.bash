#!/bin/bash

if [ ! -f .env ]; then
    echo ".env file does not exist."
    exit 1
fi

VERSION=$(sed -n 's/VERSION="\([^"]*\)"/\1/p' .env)

if [[ -n "$VERSION" ]]; then
    IFS='.' read -ra ADDR <<< "$VERSION"
    last_index=$(( ${#ADDR[@]}-1 ))
    ADDR[last_index]=$((${ADDR[last_index]} + 1))
    NEW_VERSION=$(IFS=.; echo "${ADDR[*]}")

    # Change the value of the VERSION variable in the .env file
    perl -pi -e "s/$VERSION/$NEW_VERSION/g" .env

    # Show notification
    echo "Version increased to $NEW_VERSION"

    # Add the .env file to the list of changed files to commit
    git add .env
    exit 1
fi