<template>
  <div class="store px-8 pt-28">
    <h1 class="text-center text-2xl font-bold">Boutique</h1>
    <div class="items mt-10 grid gap-8 grid-cols-5">
      <div class="card flex flex-col" v-for="item in items">
        <div class="img relative bg-gray-400 bg-cover" :style="{backgroundImage: `url(${require(`assets/images/skins/${item.img}.png`)})`}">
          <div class="p-2 rounded-md text-xs rarity absolute top-4 left-4 font-bold" :class="`-${item.rarity}`">{{item.rarity}}</div>
        </div>
        <h3 class="mt-2 mb-2 font-bold">{{ item.name }}</h3>
        <div class="flex mt-auto items-center justify-between">
          <div class="font-bold">{{ item.price }}€</div>
          <button class='hover:bg-purple-800 bg-purple-600 text-xs rounded-md text-white p-2 font-bold'>Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  middleware: ['tokens', 'spotify'],
  data: () => ({
    items: [
      {
        name: 'Ely By K.Atienza',
        price: 3,
        rarity: 'rare',
        img: 'ely'
      },
      {
        name: 'Exo Gray',
        price: 1,
        rarity: 'common',
        img: 'exo'
      },
      {
        name: 'Warrok W Kurniawan',
        price: 10,
        rarity: 'legendary',
        img: 'warrok-w-kurniawan'
      },
      {
        name: 'Mutant',
        price: 3,
        rarity: 'rare',
        img: 'mutant'
      },
      {
        name: 'Remy',
        price: 1,
        rarity: 'common',
        img: 'remy'
      },
      {
        name: 'Vanguard By T. Choonyung',
        price: 5,
        rarity: 'epic',
        img: 'vanguard'
      },
      {
        name: 'Maria J J Ong',
        price: 3,
        rarity: 'rare',
        img: 'maria'
      },
      {
        name: 'Skeletonzombie T Avelange',
        price: 1,
        rarity: 'common',
        img: 'skeleton'
      },
      {
        name: 'Erika Archer',
        price: 7,
        rarity: 'epic',
        img: 'erika'
      },
      {
        name: 'Zombie',
        price: 1,
        rarity: 'common',
        img: 'zombie'
      },
      {
        name: 'Douglas',
        price: 1,
        rarity: 'common',
        img: 'douglas'
      },
      {
        name: 'Vampire A Lusth',
        price: 10,
        rarity: 'legendary',
        img: 'vampire'
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.img {

  &:before {
    content: '';
    display: block;
    padding-bottom: 118%;
  }
}

.rarity {
  color: white;

  &.-common {
    background-color: green;
  }
  &.-rare {
    background-color: blue;
  }
  &.-epic {
    background-color: purple;
  }
  &.-legendary {
    background-color: orange;
  }
}
</style>
