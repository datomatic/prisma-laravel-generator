import fs from 'node:fs';
import path from 'node:path';

const writeFileSafely = (writeLocation: string, content: string) => {
  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, content);
};

export default writeFileSafely;
