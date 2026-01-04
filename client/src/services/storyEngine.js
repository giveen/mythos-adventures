// entire file content ...
import fs from 'fs';

export function getPrompt() {
  try {
    return fs.readFileSync('./server-prompt.md', 'utf-8');
  } catch (error) {
    console.error('Error reading prompt file:', error);
    return '# D&D Game Master\nYou are a Dungeon Master for a solo player.';
  }
}
