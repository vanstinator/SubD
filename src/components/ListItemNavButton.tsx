import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';

export default function ListItemNavButton({
  href,
  children
}: {
  href: string;
  children?: React.ReactChild | React.ReactChild[];
}) {
  const navigate = useNavigate();

  const handleNavigation = useCallback(
    event => {
      console.log(event.target);
      navigate(href, { replace: true });
    },
    [navigate]
  );
  return <ListItemButton onClick={handleNavigation}>{children}</ListItemButton>;
}
