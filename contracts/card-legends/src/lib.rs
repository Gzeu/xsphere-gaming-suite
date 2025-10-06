#![no_std]

multiversx_sc::imports!();

/// Card Legends - NFT Trading Card Game Contract
#[multiversx_sc::contract]
pub trait CardLegendsContract {
    #[init]
    fn init(&self, collection_name: ManagedBuffer, collection_ticker: ManagedBuffer) {
        self.collection_name().set(&collection_name);
        self.collection_ticker().set(&collection_ticker);
        self.card_counter().set(0u64);
    }

    // NFT Card Management
    #[endpoint(mintCard)]
    fn mint_card(&self, to: &ManagedAddress, card_name: ManagedBuffer, rarity: u8, power: u32) {
        let current_counter = self.card_counter().get();
        let new_nonce = current_counter + 1;
        
        // Store card data
        let card_data = CardData {
            name: card_name,
            rarity,
            power,
            owner: to.clone(),
        };
        
        self.card_collection().insert(new_nonce, card_data);
        self.card_counter().set(new_nonce);
    }

    #[view(getCard)]
    fn get_card(&self, nonce: u64) -> Option<CardData<Self::Api>> {
        self.card_collection().get(nonce)
    }

    #[view(getPlayerCards)]
    fn get_player_cards(&self, player: &ManagedAddress) -> ManagedVec<u64> {
        let mut player_cards = ManagedVec::new();
        let total_cards = self.card_counter().get();
        
        for nonce in 1..=total_cards {
            if let Some(card) = self.card_collection().get(nonce) {
                if card.owner == *player {
                    player_cards.push(nonce);
                }
            }
        }
        
        player_cards
    }

    // Storage mappers
    #[storage_mapper("collection_name")]
    fn collection_name(&self) -> SingleValueMapper<ManagedBuffer>;

    #[storage_mapper("collection_ticker")]
    fn collection_ticker(&self) -> SingleValueMapper<ManagedBuffer>;

    #[storage_mapper("card_counter")]
    fn card_counter(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("card_collection")]
    fn card_collection(&self) -> MapMapper<u64, CardData<Self::Api>>;
}

#[derive(TopEncode, TopDecode, TypeAbi, Clone, PartialEq, Debug)]
pub struct CardData<M: ManagedTypeApi> {
    pub name: ManagedBuffer<M>,
    pub rarity: u8, // 1=Common, 2=Rare, 3=Epic, 4=Legendary
    pub power: u32,
    pub owner: ManagedAddress<M>,
}