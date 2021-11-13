import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DownloadProgress {
  progress: number;
  current: number;
  count: number;
}

export default function DownloadModelFilesDialog(props: { open: boolean; onClose: () => void }) {
  const { onClose, open } = props;
  const [isDownloadActive, setIsDownloadActive] = useState(false);
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress>();

  const handleDownloadStart = useCallback(() => {
    window.api.ipcSend('setup.download.start');
    setIsDownloadActive(true);
  }, []);

  const handleDownloadCancel = useCallback(() => {
    window.api.ipcSend('setup.download.cancel');
  }, []);

  const handleProgress = useCallback((event, progressInfo: DownloadProgress) => {
    setProgress(progressInfo);
  }, []);

  const handleError = useCallback((event, error) => {
    console.log('error', error);
    if (error.canceled) {
      console.log('download canceled!');
    }
    setIsDownloadActive(false);
  }, []);

  const handleComplete = useCallback((event, error) => {
    setIsDownloadComplete(true);
  }, []);

  useEffect(() => {
    window.api.addIpcListener('setup.download.progress', handleProgress);
    window.api.addIpcListener('setup.download.finished', handleComplete);
    window.api.addIpcListener('setup.download.error', handleError);
    return function cleanup() {
      window.api.removeIpcListener('setup.download.progress', handleProgress);
      window.api.removeIpcListener('setup.download.finished', handleComplete);
      window.api.removeIpcListener('setup.download.error', handleError);
    };
  }, [handleComplete, handleError, handleProgress]);

  return (
    <Dialog open={open} maxWidth="sm" disableEscapeKeyDown={true}>
      <DialogTitle>Download Required Files</DialogTitle>
      <DialogContent>
        {isDownloadActive ? (
          <Grid container={true} direction="column" spacing={3}>
            <Grid item={true} xs={true} style={{ textAlign: 'center' }}>
              {isDownloadComplete ? (
                <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
              ) : (
                <>
                  <CircularProgress
                    size={80}
                    variant={progress?.progress ? 'determinate' : 'indeterminate'}
                    value={progress?.progress}
                  />
                  <Typography align="center">{progress?.progress?.toFixed(1)}%</Typography>
                </>
              )}
            </Grid>
            <Grid item={true} xs={true}>
              {isDownloadComplete ? (
                <Typography align="center">Download Complete</Typography>
              ) : (
                <Typography align="center">
                  Downloading {(progress?.current || 0) + 1} of {progress?.count}
                </Typography>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography>
            We use the deepspeech library to analyze your media files for subtitle accuracy. We'll need to download some
            files to make the magic happen.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isDownloadActive ? (
          isDownloadComplete ? (
            <Button onClick={onClose}>Done</Button>
          ) : (
            <Button onClick={handleDownloadCancel}>Cancel</Button>
          )
        ) : (
          <Button onClick={handleDownloadStart}>Download Files</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
