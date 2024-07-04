#!/bin/bash

#takes <dir> <wordToSearchFor> <wordToReplaceWith> and replaces all instances in all files in the dir
# e.g. folderStreamEdit . this that

dir=$1
srchFor=$2
replWith=$3

if [ -d $dir ]
then   
	   #for each file in this dir
	for FILE in $dir; 
	do
		if [ $FILE==$0 ]
			then   echo Skip editing the script!
		else
			sed -i "s/$srchFor/$replWith/g" $FILE
		fi
	done

else
   sed -i "s/$srchFor/$replWith/g" $dir
fi

