#!/bin/bash

green="\e[0;32m"
rst="\e[0m"     # Text reset

prepare()
{
    echo -en $green$1$rst"\n"
}

prepare "Update web component"

cd ../sc-web/
npm install
grunt build
cd ../ui_components/formation_of_the_expected_list_of_speakers
npm install
grunt build

cd ../../scripts
