import { useSignal } from '@preact/signals';
import LoginIsland from '../islands/LoginIsland.tsx';
import ChatIsland from '../islands/ChatIsland.tsx';

export default function Home() {
  return (
    <div class='app'>
      <LoginIsland />
    </div>
  );
}
