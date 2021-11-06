import server from 'lib/server';

(() => {
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
})();
