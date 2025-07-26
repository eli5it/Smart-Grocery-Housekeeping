const InventoryPage = () => {
  const expiringCount = 3;
  const expiredCount = 4;
  const totalItemCount = 5;

  return (
    <>
      <h1 className="text-4xl font-bold my-6">Inventory</h1>
      <ul className="flex gap-5 max-w-[1000px]">
        <li className="flex flex-1 bg-light-green rounded-lg px-2 py-3 gap-2">
          <img
            className="w-8 md:w-12 h-auto"
            src="/broccoli.png"
            alt="broccoli"
          />
          <div className="">
            <p className="md:text-2xl">Total Items</p>
            <p className="font-bold md:text-2xl">{totalItemCount}</p>
          </div>
        </li>
        <li className="flex flex-1 bg-yellow rounded-lg px-2 py-3 gap-2">
          <img
            className="w-8 md:w-12 h-auto"
            src="/hourglass.png"
            alt="hourglass"
          />
          <div className="">
            <p className="md:text-2xl">Expiring Soon</p>
            <p className="font-bold md:text-2xl">{expiringCount}</p>
          </div>
        </li>
        <li className="flex flex-1 bg-light-red rounded-lg px-2 py-3 gap-2">
          <img
            className="w-8 md:w-12 h-auto"
            src="/warning.png"
            alt="warning"
          />
          <div className="">
            <p className="md:text-2xl">Expired</p>
            <p className="font-bold md:text-2xl">{expiredCount}</p>
          </div>
        </li>
      </ul>
    </>
  );
};

export default InventoryPage;
