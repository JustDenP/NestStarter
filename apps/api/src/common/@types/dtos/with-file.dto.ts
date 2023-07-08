import { IFile } from '../interfaces/file.interface';

// This type represents a dto that contains a file.
export type DTOWithFile<T, K = IFile> = T & {
  files: K;
};
