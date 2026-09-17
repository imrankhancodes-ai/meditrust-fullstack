// Shaped skeletons that mirror real layout — not gray boxes.

function Shimmer({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <Shimmer className="aspect-[4/3] !rounded-none" />
      <div className="space-y-2 p-4">
        <Shimmer className="h-3 w-2/3" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-3 w-1/3" />
        <Shimmer className="h-9 w-full !rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Shimmer className="h-12 w-12 !rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-2/3" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
      </div>
      <div className="mt-4 flex gap-2">
        <Shimmer className="h-10 flex-1 !rounded-xl" />
        <Shimmer className="h-10 flex-1 !rounded-xl" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6, Card = DoctorCardSkeleton }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}

export function LabCardSkeleton() {
  return <DoctorCardSkeleton />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <Shimmer className="h-11 w-11 !rounded-2xl" />
      <Shimmer className="mt-3 h-8 w-1/2" />
      <Shimmer className="mt-2 h-3 w-2/3" />
    </div>
  );
}

export function StatRowSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Shimmer className="h-3 w-1/3" />
        <Shimmer className="h-5 w-20 !rounded-full" />
      </div>
      <Shimmer className="mt-2 h-3 w-2/3" />
    </div>
  );
}

export function OrderListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <OrderRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChatBubbleSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end"><Shimmer className="h-12 w-2/3 !rounded-2xl !rounded-br-md" /></div>
      <div className="flex justify-start"><Shimmer className="h-16 w-3/4 !rounded-2xl !rounded-bl-md" /></div>
      <div className="flex justify-end"><Shimmer className="h-10 w-1/2 !rounded-2xl !rounded-br-md" /></div>
    </div>
  );
}

export function ListSkeletonShaped({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
          <Shimmer className="h-4 w-1/3" />
          <Shimmer className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}
