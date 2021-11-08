import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SelectFileButton from '../components/SelectFileButton';

interface AnalyzeFiles {
  movie?: { name: string; path: string; size: number };
  subtitle?: { name: string; path: string; size: number };
}

export default function Analyze() {
  const [files, setFiles] = useState<AnalyzeFiles>({});
  const handleAnalyze = useCallback(() => {
    console.log(files);
    window.api.ipcSend('analyze.start', files);
  }, [files]);
  const handleMovieSelect = useCallback(fileList => {
    const [movie] = fileList;
    const { name, path, size } = movie;
    setFiles(files => ({
      ...files,
      movie: { name, path, size }
    }));
  }, []);
  const handleMovieReset = useCallback(() => {
    delete files.movie;
    setFiles(files);
  }, [files]);
  const handleSubSelect = useCallback(fileList => {
    const [subtitle] = fileList;
    const { name, path, size } = subtitle;
    setFiles(files => ({
      ...files,
      subtitle: { name, path, size }
    }));
  }, []);
  const handleSubReset = useCallback(() => {
    delete files.subtitle;
    setFiles(files);
  }, [files]);
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Analyze Movie Subtitles</Typography>
      </Box>
      <Grid container={true} direction="column" spacing={3}>
        <Grid item={true}>
          <SelectFileButton
            accept=".mp3,.m4s,.mkv,.mp4,.avi,.mpg"
            onChange={handleMovieSelect}
            onReset={handleMovieReset}
          >
            Select Movie File
          </SelectFileButton>
        </Grid>
        <Grid item={true} xs={true}>
          <SelectFileButton accept=".srt" onChange={handleSubSelect} onReset={handleSubReset}>
            Select Sub File
          </SelectFileButton>
        </Grid>
        <Grid item={true} xs={true}>
          <Button
            disabled={!files.movie || !files.subtitle}
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
          >
            Analyze
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
