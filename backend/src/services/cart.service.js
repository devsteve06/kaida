import cartItemsModel from "../models/cart_items.model.js";
import cartModel from "../models/cart.model.js";

const cartService = {
  async getOrCreateCart(client, userId) {
    let cart = await cartModel.findByUserId(client, userId);

    if (!cart) {
      cart = await cartModel.create(client, userId);
      
      if (!cart) {
        throw new Error("Failed to create cart");
      }
    }

    return cart;
  },

  async addToCart(client, userId, productId, quantity) {
    const cart = await this.getOrCreateCart(client, userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }
    
    return cartItemsModel.addItem(client, cart.id, productId, quantity);
  },

  async getCart(client, userId) {
    const cart = await this.getOrCreateCart(client, userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }
    
    const items = await cartItemsModel.getItems(client, cart.id);

    return {
      cartId: cart.id,
      items
    };
  }
};

export default cartService;
