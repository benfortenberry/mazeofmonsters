// Single source of truth for every image the game displays. Loaded (fetched +
// decoded) during the intro so the loading bar is accurate and every picture is
// paint-ready before gameplay — no first-show pop-in anywhere.
export const GAME_IMAGES: string[] = [
    // maze walls / floor / ceiling
    'assets/new-sandstone-3.jpg',
    'assets/new-sandstone-4.jpg',
    'assets/new-sandstone-5.jpg',
    'assets/sandy.jpg',
    'assets/stone.jpg',
    'assets/sandstone-large.jpg',

    // monsters (shown on encounter)
    'assets/monsters/DivineGuardian.png',
    'assets/monsters/Dragon.png',
    'assets/monsters/Goblin.png',
    'assets/monsters/Lichlord.png',
    'assets/monsters/Naga.png',
    'assets/monsters/Orc.png',
    'assets/monsters/Ratman.png',
    'assets/monsters/Treefolk.png',
    'assets/monsters/Troll.png',
    'assets/monsters/zombie.png',

    // mini-game art
    'assets/gems/aqua.png',
    'assets/gems/red.png',
    'assets/gems/blue.png',
    'assets/gems/violet.png',
    'assets/gems/yellow.png',
    'assets/gems/green.png',
    'assets/orb/planet-1.png',
    'assets/orb/planet-3.png',
    'assets/orb/planet-5.png',
    'assets/orb/planet-9.png',
    'assets/orb/planet-10.png',
    'assets/xando/frame1.png',
    'assets/xando/x.png',
    'assets/ssb/RoundShield.png',
    'assets/ssb/ShortBow.png',
    'assets/ssb/LongSword.png',
    'assets/minigames/full_yellow_2.png',

    // death screen art (one shown at random on loss)
    'assets/death/boss_goblinbigboss.png',
    'assets/death/boss_thenightmother.png',
    'assets/death/boss_voidelemental.png',
    'assets/death/monster_crystalgolem.png',
    'assets/death/monster_deepelf.png',
    'assets/death/monster_demilich.png',
    'assets/death/monster_devilkin.png',
    'assets/death/monster_dragonwhelp.png',
    'assets/death/monster_fireelemental.png',
    'assets/death/monster_goblinveteran.png',
    'assets/death/monster_imp.png',
    'assets/death/monster_minotaur.png',
    'assets/death/monster_ooze.png',
    'assets/death/monster_ratling.png',
    'assets/death/monster_treefolk.png',
    'assets/death/monster_werewolfcub.png',

    // win screen
    'assets/cave-exit.jpg'
];
