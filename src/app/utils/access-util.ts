export function getBasePath() {
    const paths: string[] = location.pathname.split('/').splice(1, 1);
    let basePath = '/';
    /*if (paths[0] !== 'AccessGrantService') {
      basePath = '/AccessGrantService';
    }*/
    return basePath;
  }
  