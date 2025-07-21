const BuildInfo = () => (
  <div style={{
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    wordBreak: 'break-all'
  }}>
    Build: {process.env.REACT_APP_BUILD_TIME || 'unknown'}
  </div>
);

export default BuildInfo; 