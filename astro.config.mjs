export default ({ mode }) => ({
  site: mode === 'production'
    ? 'https://github.com/sbnorton'
    : 'http://localhost:4321',

  base: mode === 'production'
    ? '/sarahs-website'
    : '/',
});