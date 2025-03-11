import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicMap = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

<Suspense fallback={<p>Loading map...</p>}>
    {isOpen && <DynamicMap center={[51, -0.9]} />}
</Suspense>;
