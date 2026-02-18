import stripeService from './stripeService.js'
import mpesaService from './mpesaService.js';

export default function paymentFactory(provider){
    if (!provider || typeof provider !== 'string') {
        throw new Error("Unsupported Payment Provider");
    }
    
    const normalizedProvider = provider.toLowerCase().trim();
    
    switch(normalizedProvider){
        case "stripe":
            return stripeService;

        case "mpesa" :
            return mpesaService;
        
        default :
            throw new Error("Unsupported Payment Provider");
            
    }
}
