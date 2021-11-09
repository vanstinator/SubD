import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BuildIcon from '@mui/icons-material/BuildCircle';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemNavButton from 'components/ListItemNavButton';
import DownloadModelFilesDialog from 'components/dialogs/DownloadModelFilesDialog';
import Crawl from 'routes/Crawl';
import Analyze from 'routes/Analyze';

function App() {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const handleStartupResult = (event: any, result: any) => {
    if (!result?.hasModelFiles) {
      // show prompt
      setDownloadDialogOpen(true);
    }
    console.log('handleStartupResult', result);
  };
  const handleDialogClose = useCallback(() => {
    console.log('Closed');
    setDownloadDialogOpen(false);
  }, []);

  useEffect(() => {
    window.api.ipcSend('analyze.startupCheck');
    window.api.addIpcListener('analyze.startupResult', handleStartupResult);
  }, []);

  return (
    <div className="App">
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={3}>
          <nav aria-label="main sections">
            <List>
              <ListItem disablePadding>
                <ListItemNavButton href="/">
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Crawl" />
                </ListItemNavButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemNavButton href="/analyze">
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary="Analyze" />
                </ListItemNavButton>
              </ListItem>
            </List>
          </nav>
        </Grid>
        <Grid item={true} xs={true}>
          <Routes>
            <Route path="/" element={<Crawl />} />
            <Route path="analyze" element={<Analyze />} />
          </Routes>
        </Grid>
      </Grid>
      <DownloadModelFilesDialog open={downloadDialogOpen} onClose={handleDialogClose} />
    </div>
  );
}

export default App;
