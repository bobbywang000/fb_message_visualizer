import ftfy
from glob import glob
from json import loads, dumps
from sys import argv
from os.path import join

# quick and dirty script to fix what Typescript believes is badly encoded unicode
# in the facebook json data dump

def fix_text_recursive(node):
    if isinstance(node, str):
        return ftfy.fix_text(node)
    elif isinstance(node, list):
        return list(map(fix_text_recursive, node))
    elif isinstance(node, dict):
        return { fix_text_recursive(k): fix_text_recursive(v) for k, v in node.items() }
    else:
        return node

def reencode_file(filename):
    with open(filename, 'r') as file:
        raw_json = loads("".join(file.readlines()))
    with open(filename, 'w') as file:
        file.writelines(dumps(fix_text_recursive(raw_json), indent=4))

def get_all_json_files(fbJsonRootDir):
    return glob(join(fbJsonRootDir, 'messages/**/*.json'))

if (len(argv) != 1):
    print("Usage: python fix_json_encodings.py <PATH_TO_FACEBOOK_JSON_ROOT_DIR>")
    exit(1)

for json_file in get_all_json_files(argv[0]):
    reencode_file(json_file)
