export interface Promocode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  description: string;
  minAmount?: number;
  expiresAt?: Date;
}

export const promocodes: Promocode[] = [
  {
    code: 'ПЕРВЫЙ',
    discount: 10,
    type: 'percent',
    description: 'Скидка 10% на первый заказ',
  },
  {
    code: 'ЛЕТО2026',
    discount: 15,
    type: 'percent',
    description: 'Летняя скидка 15%',
    minAmount: 50000,
  },
  {
    code: 'VIP',
    discount: 5000,
    type: 'fixed',
    description: 'Фиксированная скидка 5000 ₽',
    minAmount: 30000,
  },
  {
    code: 'ДРУГ',
    discount: 20,
    type: 'percent',
    description: 'Скидка 20% по рекомендации',
  },
];

export const promocodeService = {
  validatePromocode(code: string): Promocode | null {
    const promo = promocodes.find(
      (p) => p.code.toUpperCase() === code.toUpperCase()
    );

    if (!promo) return null;

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return null;
    }

    return promo;
  },

  calculateDiscount(totalAmount: number, promocode: Promocode): number {
    if (promocode.minAmount && totalAmount < promocode.minAmount) {
      return 0;
    }

    if (promocode.type === 'percent') {
      return Math.floor((totalAmount * promocode.discount) / 100);
    } else {
      return Math.min(promocode.discount, totalAmount);
    }
  },

  applyPromocode(totalAmount: number, code: string): {
    isValid: boolean;
    discount: number;
    finalAmount: number;
    message: string;
    promocode?: Promocode;
  } {
    const promocode = this.validatePromocode(code);

    if (!promocode) {
      return {
        isValid: false,
        discount: 0,
        finalAmount: totalAmount,
        message: 'Промокод не найден или истёк',
      };
    }

    if (promocode.minAmount && totalAmount < promocode.minAmount) {
      return {
        isValid: false,
        discount: 0,
        finalAmount: totalAmount,
        message: `Минимальная сумма для этого промокода: ${promocode.minAmount.toLocaleString('ru-RU')} ₽`,
        promocode,
      };
    }

    const discount = this.calculateDiscount(totalAmount, promocode);
    const finalAmount = totalAmount - discount;

    return {
      isValid: true,
      discount,
      finalAmount,
      message: promocode.description,
      promocode,
    };
  },
};
