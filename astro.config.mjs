export default ({ mode }) => ({
  site: mode === 'production'
    ? 'https:/sbnorton.github.io'
    : 'http://localhost:4321',

  base: mode === 'production'
    ? '/sarahs-website'
    : '/',
});