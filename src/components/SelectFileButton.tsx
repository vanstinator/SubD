import React, { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import uniqueId from '../utils/uniqueId';

const Input = styled('input')({
  display: 'none'
});

export default function SelectFileButton({
  accept,
  children,
  onChange,
  onReset
}: {
  accept?: string;
  children?: React.ReactNode | React.ReactNode[];
  onChange: (files: FileList) => void;
  onReset: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const refId = `select-file-${uniqueId()}`;

  const handleReset = useCallback(() => {
    setSelectedFile(undefined);
    onReset();
  }, [onReset]);

  const handleSelect = useCallback(
    event => {
      console.log(event.target.files);
      if (event.target.files.length) {
        setSelectedFile(event.target.files[0].name);
        onChange(event.target.files);
      }
    },
    [onChange]
  );

  return (
    <>
      {selectedFile ? (
        <Grid container={true} alignItems="center">
          <Grid item={true}>{selectedFile}</Grid>
          <Grid item={true} onClick={handleReset}>
            <Button>Remove</Button>
          </Grid>
        </Grid>
      ) : (
        <label htmlFor={refId}>
          <div>
            <Input accept={accept} id={refId} type="file" onChange={handleSelect} />
            <Button component="span">{children}</Button>
          </div>
        </label>
      )}
    </>
  );
}
