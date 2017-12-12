import { Injectable } from '@angular/core';
import { Workspace } from 'app/models/workspace';
import * as fs from 'fs';
import * as path from 'path';
import * as tree from 'directory-tree';
import * as mkdirp from 'mkdirp';
import * as yaml from 'js-yaml';

import { File } from 'app/models/file';
import { environment } from '../../environments';


@Injectable()
export class FileService {

  constructor() { }

  readFile(file: string): string {
    return fs.readFileSync(file).toString();
  }

  isTasteeFile(file: File) {
    return path.extname(file.name) === environment.tastee_file_ext;
  }


  isConfigFile(file: File) {
    return path.extname(file.name) === environment.tastee_config_file_ext;
  }

  saveFile(file: File, data: string): File {
    if (!file.path) {
      file.path = path.join(file.directory, file.name);
      mkdirp.sync(file.directory);
    }
    fs.writeFileSync(path.join(file.directory, file.name), data);
    return file;
  }

  createFile(file: string) {
    fs.writeFileSync(file, '');
  }

  deleteFile(file: File) {
    fs.unlinkSync(file.path.toString());
    const files = fs.readdirSync(file.directory);
    if (files.length === 0) {
      fs.rmdirSync(file.directory);
    }
  }
  getFilesInWorkspace(workspace: Workspace) {
    return tree(workspace.workspacePath)
  }

  getParentDirectory(file: File): string {
    return path.dirname(file.path.toString());
  }

  validateYaml(file: File): string {
    try {
      yaml.safeLoad(file.data);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
