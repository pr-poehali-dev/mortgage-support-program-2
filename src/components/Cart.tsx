import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { cartService, CartItem } from '@/services/cart';
import { promocodeService, Promocode } from '@/services/promocodes';
import CartOrderForm from '@/components/CartOrderForm';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [promocodeInput, setPromocodeInput] = useState('');
  const [appliedPromocode, setAppliedPromocode] = useState<Promocode | null>(null);
  const [promocodeError, setPromocodeError] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateCart = () => {
    setCartItems(cartService.getCart());
  };

  useEffect(() => {
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartService.getTotalPrice();
  const finalPrice = totalPrice - discount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    cartService.updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    cartService.removeItem(itemId);
  };

  const handleApplyPromocode = () => {
    if (!promocodeInput.trim()) {
      setPromocodeError('Введите промокод');
      return;
    }

    const result = promocodeService.applyPromocode(totalPrice, promocodeInput);

    if (result.isValid) {
      setAppliedPromocode(result.promocode!);
      setDiscount(result.discount);
      setPromocodeError('');
      setPromocodeInput('');
    } else {
      setPromocodeError(result.message);
      setAppliedPromocode(null);
      setDiscount(0);
    }
  };

  const handleRemovePromocode = () => {
    setAppliedPromocode(null);
    setDiscount(0);
    setPromocodeError('');
  };

  return (
    <>
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="relative rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="lg"
          >
            <Icon name="ShoppingCart" size={28} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {itemCount}
            </span>
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Корзина</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>
              <p className="text-blue-100">
                {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'услуга' : 'услуги'}` : 'Пусто'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ShoppingCart" size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Корзина пуста</p>
                  <p className="text-gray-400 text-sm mt-2">Добавьте услуги для заказа</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="text-blue-600 font-semibold">{item.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Количество:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t bg-gray-50 p-6">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Icon name="Tag" size={16} />
                    Промокод
                  </label>
                  {appliedPromocode ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-green-700">{appliedPromocode.code}</p>
                        <p className="text-xs text-green-600">{appliedPromocode.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleRemovePromocode}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promocodeInput}
                        onChange={(e) => {
                          setPromocodeInput(e.target.value.toUpperCase());
                          setPromocodeError('');
                        }}
                        placeholder="Введите код"
                        className="uppercase"
                      />
                      <Button
                        onClick={handleApplyPromocode}
                        variant="outline"
                        size="sm"
                      >
                        <Icon name="Check" size={16} />
                      </Button>
                    </div>
                  )}
                  {promocodeError && (
                    <p className="text-xs text-red-500 mt-1">{promocodeError}</p>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Сумма:</span>
                    <span className="font-semibold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Скидка:</span>
                      <span className="font-semibold text-green-600">-{discount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {finalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowOrderForm(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  size="lg"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Оформить заявку
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm('Очистить корзину?')) {
                      cartService.clearCart();
                    }
                  }}
                  className="w-full mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Очистить корзину
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <CartOrderForm 
        isOpen={showOrderForm} 
        onClose={() => setShowOrderForm(false)}
        appliedPromocode={appliedPromocode}
        discount={discount}
      />
    </>
  );
}