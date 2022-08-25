import {randomInt} from 'node:crypto';
import ucwords from '../../../utils/strings/ucwords';
import snake from '../../../utils/strings/snake';

const generateStrings = () => {
  const words = [
    'walk',
    'butter',
    'legal',
    'greasy',
    'dare',
    'bitter',
    'roasted',
    'coherent',
    'magenta',
    'store',
    'jump',
    'dear',
    'woozy',
    'actually',
    'skate',
    'soggy',
    'giants',
    'fluffy',
    'kittens',
    'relax',
    'curve',
    'bike',
    'reject',
    'discover',
    'night',
    'wrist',
    'health',
    'ambiguous',
    'hard-to-find',
    'spill',
    'sincere',
    'depend',
    'pedal',
    'analyze',
    'wrathful',
    'marked',
    'object',
    'gate',
    'huge',
    'club',
    'appreciate',
    'rely',
    'torpid',
    'pathetic',
    'live',
    'accurate',
    'sturdy',
    'spotless',
    'cannon',
    'bee',
    'rabbits',
    'books',
    'brawny',
    'man',
    'frantic',
    'partner',
    'development',
    'oceanic',
    'hilarious',
    'entertain',
    'frightening',
    'listen',
    'bomb',
    'holiday',
    'stretch',
    'sloppy',
    'view',
    'heal',
    'debt',
    'present',
    'statement',
    'impulse',
    'bump',
    'texture',
    'truculent',
    'reflect',
    'settle',
    'chickens',
    'frightened',
    'absorbing',
    'knotty',
    'obedient',
    'pet',
    'passenger',
    'leather',
    'steadfast',
    'calculating',
    'flippant',
    'unit',
    'compare',
    'sick',
    'thankful',
    'embarrassed',
    'pause',
    'team',
    'sable',
    'tire',
    'free',
    'adjoining',
    'scissors',
  ];

  const strings = [];
  for (let index = 0; index < 100; index += 1) {
    const nWords = randomInt(1, 7);
    let string = '';
    for (let wordIndex = 0; wordIndex < nWords; wordIndex += 1) {
      if (randomInt(100) < 70) {
        let word = words[randomInt(words.length)];
        switch (randomInt(3)) {
          case 1:
            word = word.toUpperCase();
            break;
          case 2:
            word = ucwords(word);
            break;
          default:
            word = word.toLowerCase();
            break;
        }
        string += ` ${word}`;

        if (randomInt(100) < 10) {
          const symbols = ['?', '!', '.', ','];
          string += symbols[randomInt(symbols.length)];
        }
      } else {
        string += ` ${randomInt(0, 10_000)}`;
      }
    }
    strings.push(string.trimStart());
  }

  return strings;
};

const testStrings = [
  ['VIEW', 'v_i_e_w'],
  ['8967 ambiguous Statement', '8967_ambiguous_statement'],
  ['6671 9660 733 3046', '667196607333046'],
  ['2604 Giants SPOTLESS!', '2604_giants_s_p_o_t_l_e_s_s!'],
  ['MAGENTA 5366 hilarious', 'm_a_g_e_n_t_a5366_hilarious'],
  [
    'MAGENTA man wrathful. 9540 ANALYZE',
    'm_a_g_e_n_t_a_man_wrathful.9540_a_n_a_l_y_z_e',
  ],
  ['1320', '1320'],
  ['SINCERE 2940 sick', 's_i_n_c_e_r_e2940_sick'],
  ['Man CALCULATING', 'man_c_a_l_c_u_l_a_t_i_n_g'],
  ['1792 obedient pet, 1927', '1792_obedient_pet,1927'],
  [
    'WRIST Impulse wrathful Absorbing Knotty DARE',
    'w_r_i_s_t_impulse_wrathful_absorbing_knotty_d_a_r_e',
  ],
  ['849 Reject object 2067 Gate 7661', '849_reject_object2067_gate7661'],
  ['Hard-to-find 303 4992 STURDY', 'hard-to-find3034992_s_t_u_r_d_y'],
  ['Brawny 6191 2210 Frantic', 'brawny61912210_frantic'],
  ['7126', '7126'],
  ['HILARIOUS hilarious 2884', 'h_i_l_a_r_i_o_u_s_hilarious2884'],
  [
    'spotless STURDY kittens KITTENS RABBITS Brawny',
    'spotless_s_t_u_r_d_y_kittens_k_i_t_t_e_n_s_r_a_b_b_i_t_s_brawny',
  ],
  [
    'HILARIOUS Pause HOLIDAY 4017 SOGGY 9584',
    'h_i_l_a_r_i_o_u_s_pause_h_o_l_i_d_a_y4017_s_o_g_g_y9584',
  ],
  ['books BIKE 5518 6306 SETTLE', 'books_b_i_k_e55186306_s_e_t_t_l_e'],
  ['DEAR Pet legal', 'd_e_a_r_pet_legal'],
  ['gate cannon', 'gate_cannon'],
  ['2366 ENTERTAIN impulse 4932', '2366_e_n_t_e_r_t_a_i_n_impulse4932'],
  ['7600 2556', '76002556'],
  ['8225 Relax', '8225_relax'],
  ['Relax 5984 ABSORBING 23 3036', 'relax5984_a_b_s_o_r_b_i_n_g233036'],
  ['Dare DEBT Sincere', 'dare_d_e_b_t_sincere'],
  ['388', '388'],
  ['butter sloppy statement Bump bee', 'butter_sloppy_statement_bump_bee'],
  ['4716 woozy!', '4716_woozy!'],
  ['5271 GIANTS', '5271_g_i_a_n_t_s'],
  ['Jump 2453', 'jump2453'],
  ['BRAWNY', 'b_r_a_w_n_y'],
  ['7779 6477', '77796477'],
  ['team HILARIOUS', 'team_h_i_l_a_r_i_o_u_s'],
  ['2411 8080 hilarious', '24118080_hilarious'],
  [
    'Truculent, 5538 MAN, 1031 frightened 2678',
    'truculent,5538_m_a_n,1031_frightened2678',
  ],
  ['1658 obedient', '1658_obedient'],
  ['7097', '7097'],
  ['NIGHT 6927', 'n_i_g_h_t6927'],
  ['walk 2909 health. 9145', 'walk2909_health.9145'],
  ['Reject', 'reject'],
  ['Live. thankful!', 'live._thankful!'],
  [
    'stretch? STATEMENT SABLE Actually',
    'stretch?_s_t_a_t_e_m_e_n_t_s_a_b_l_e_actually',
  ],
  ['COMPARE hard-to-find 451', 'c_o_m_p_a_r_e_hard-to-find451'],
  ['Kittens', 'kittens'],
  ['Chickens 6998', 'chickens6998'],
  ['Bomb kittens', 'bomb_kittens'],
  ['3230 3604 Bomb, BEE 1556', '32303604_bomb,_b_e_e1556'],
  [
    'Magenta woozy! marked 4561 Magenta 9536',
    'magenta_woozy!_marked4561_magenta9536',
  ],
  [
    'Actually Torpid Sturdy 8213 626 Present',
    'actually_torpid_sturdy8213626_present',
  ],
  ['9685 WOOZY 1375 5128 9842', '9685_w_o_o_z_y137551289842'],
  [
    'SPILL Reject reject LISTEN UNIT? 9735',
    's_p_i_l_l_reject_reject_l_i_s_t_e_n_u_n_i_t?9735',
  ],
  [
    'PASSENGER walk BITTER 842 2077 2364',
    'p_a_s_s_e_n_g_e_r_walk_b_i_t_t_e_r84220772364',
  ],
  [
    'Discover reflect PASSENGER RABBITS',
    'discover_reflect_p_a_s_s_e_n_g_e_r_r_a_b_b_i_t_s',
  ],
  ['6277 7360 Chickens', '62777360_chickens'],
  ['chickens 6537', 'chickens6537'],
  [
    'PRESENT? TORPID 6046 8114 Sick 4338',
    'p_r_e_s_e_n_t?_t_o_r_p_i_d60468114_sick4338',
  ],
  ['BOMB unit 6673', 'b_o_m_b_unit6673'],
  ['8671 Chickens Stretch', '8671_chickens_stretch'],
  ['SPOTLESS dear Walk', 's_p_o_t_l_e_s_s_dear_walk'],
  ['Present Huge! Spill', 'present_huge!_spill'],
  [
    'DEVELOPMENT 3382 9930 1810 Team? KNOTTY',
    'd_e_v_e_l_o_p_m_e_n_t338299301810_team?_k_n_o_t_t_y',
  ],
  ['THANKFUL', 't_h_a_n_k_f_u_l'],
  ['STORE Pathetic CURVE, Frantic', 's_t_o_r_e_pathetic_c_u_r_v_e,_frantic'],
  ['Gate STORE', 'gate_s_t_o_r_e'],
  ['EMBARRASSED', 'e_m_b_a_r_r_a_s_s_e_d'],
  [
    'cannon. EMBARRASSED wrathful Reflect OBEDIENT 4990',
    'cannon._e_m_b_a_r_r_a_s_s_e_d_wrathful_reflect_o_b_e_d_i_e_n_t4990',
  ],
  ['9232 UNIT Pause WALK FLUFFY', '9232_u_n_i_t_pause_w_a_l_k_f_l_u_f_f_y'],
  ['Butter', 'butter'],
  [
    'magenta Pedal 7669 RELY Store Absorbing',
    'magenta_pedal7669_r_e_l_y_store_absorbing',
  ],
  [
    'Wrathful huge, pathetic 6693 bomb Statement,',
    'wrathful_huge,_pathetic6693_bomb_statement,',
  ],
  ['WOOZY', 'w_o_o_z_y'],
  [
    'team BUTTER 7762 Statement Sable Frantic',
    'team_b_u_t_t_e_r7762_statement_sable_frantic',
  ],
  ['Object', 'object'],
  ['flippant? woozy? TEAM brawny Heal', 'flippant?_woozy?_t_e_a_m_brawny_heal'],
  ['Curve SLOPPY Heal', 'curve_s_l_o_p_p_y_heal'],
  ['4757', '4757'],
  ['8513 3080 UNIT 2613', '85133080_u_n_i_t2613'],
  ['rabbits pedal Butter', 'rabbits_pedal_butter'],
  [
    'wrist Leather CLUB 6339 entertain sable',
    'wrist_leather_c_l_u_b6339_entertain_sable',
  ],
  ['Frightened', 'frightened'],
  ['partner health 9021 5985 Unit', 'partner_health90215985_unit'],
  ['BRAWNY CALCULATING BOOKS', 'b_r_a_w_n_y_c_a_l_c_u_l_a_t_i_n_g_b_o_o_k_s'],
  [
    '4631 203 BIKE Frantic ROASTED stretch',
    '4631203_b_i_k_e_frantic_r_o_a_s_t_e_d_stretch',
  ],
  ['FRIGHTENING BUMP', 'f_r_i_g_h_t_e_n_i_n_g_b_u_m_p'],
  [
    'ANALYZE SETTLE legal GIANTS',
    'a_n_a_l_y_z_e_s_e_t_t_l_e_legal_g_i_a_n_t_s',
  ],
  [
    'Bomb Frantic Absorbing CHICKENS butter',
    'bomb_frantic_absorbing_c_h_i_c_k_e_n_s_butter',
  ],
  ['fluffy Jump WRATHFUL', 'fluffy_jump_w_r_a_t_h_f_u_l'],
  [
    'REJECT Magenta? wrathful. Bee SICK',
    'r_e_j_e_c_t_magenta?_wrathful._bee_s_i_c_k',
  ],
  ['Holiday Compare FLIPPANT BOMB', 'holiday_compare_f_l_i_p_p_a_n_t_b_o_m_b'],
  ['1595 5732 Stretch leather', '15955732_stretch_leather'],
  ['2471 5036', '24715036'],
  ['344', '344'],
  ['calculating Bike 4491 TIRE 4164', 'calculating_bike4491_t_i_r_e4164'],
  ['Discover Live Torpid?', 'discover_live_torpid?'],
  ['dear Skate Store kittens', 'dear_skate_store_kittens'],
  [
    'EMBARRASSED! 4303 frightening SABLE Scissors',
    'e_m_b_a_r_r_a_s_s_e_d!4303_frightening_s_a_b_l_e_scissors',
  ],
  ['5274', '5274'],
  ['Debt chickens Leather Unit', 'debt_chickens_leather_unit'],
  ['embarrassed ambiguous 3711', 'embarrassed_ambiguous3711'],
];

test.each(testStrings)('snake: %s', (value, expected) => {
  expect(snake(value)).toBe(expected);
});
