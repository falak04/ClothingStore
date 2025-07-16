export default function CartItem({ item, onUpdate, onRemove }) {
  const product = item.productId;
  if (!product) {
    // Product was deleted or not found
    return (
      <div className="flex items-center gap-4 bg-pale-pink rounded-2xl shadow p-4 mb-6 text-red-500">
        Product not found or has been removed.
        <button
          className="ml-4 text-xs text-classic-pink hover:underline"
          onClick={() => onRemove(item._id)}
        >
          Remove
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-6 bg-pale-pink rounded-2xl shadow p-4 mb-6">
      <img src={product.imageUrl} alt={product.name} className="w-28 h-28 object-contain rounded bg-light-pink" />
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">{product.name}</div>
            <div className="text-gray-500 text-sm mb-1">Rs. {product.price?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            {item.color && (
              <div className="text-xs text-gray-500">Colour: {item.color}</div>
            )}
            {item.size && (
              <div className="text-xs text-gray-500">Size: {item.size}</div>
            )}
          </div>
          <button
            className="text-xs text-classic-pink hover:underline ml-4"
            onClick={() => onRemove(item._id)}
          >
            Remove
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            className="w-8 h-8 border border-classic-pink rounded text-lg font-bold flex items-center justify-center bg-white text-classic-pink hover:bg-classic-pink hover:text-white transition"
            onClick={() => onUpdate(item._id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center font-semibold">{item.quantity}</span>
          <button
            className="w-8 h-8 border border-classic-pink rounded text-lg font-bold flex items-center justify-center bg-white text-classic-pink hover:bg-classic-pink hover:text-white transition"
            onClick={() => onUpdate(item._id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <div className="mt-2 text-sm text-classic-pink font-semibold">
          Total: Rs. {(product.price * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </div>
      </div>
    </div>
  );
} 