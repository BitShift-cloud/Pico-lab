import { PicoLabProvider } from '@/context/PicoLabContext';
import { PicoLabApp } from '@/components/pico/PicoLabApp';

const Index = () => {
  return (
    <PicoLabProvider>
      <PicoLabApp />
    </PicoLabProvider>
  );
};

export default Index;
