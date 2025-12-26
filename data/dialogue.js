// Dialogue Data - All story conversations
// =========================================

export const DIALOGUE_DATA = {
    // =====================
    // DAY 1 - AWAKENING
    // =====================

    'hatching_1': {
        lines: [
            { speaker: 'narrator', text: '...' },
            { speaker: 'narrator', text: 'Darkness. Warmth. A steady heartbeat.' },
            { speaker: 'narrator', text: 'Then... a crack. Light seeps in.' }
        ]
    },

    'hatching_2': {
        lines: [
            { speaker: 'narrator', text: 'You push. The shell gives way.' },
            { speaker: 'narrator', text: 'The world is bright. Overwhelming. Beautiful.' },
            { speaker: 'mama', text: 'There you are, little one.' },
            { speaker: 'mama', text: 'I\'ve been waiting for you.' },
            { speaker: 'narrator', text: 'A warm face looks down at you. Your mother.' },
            { speaker: 'mama', text: 'Welcome to the world, Pip.' }
        ]
    },

    'mama_intro': {
        lines: [
            { speaker: 'mama', text: 'This is our nest. Our home, high in the old oak tree.' },
            { speaker: 'mama', text: 'Try moving around a little. Use the arrow keys to hop.' },
            { speaker: 'mama', text: 'Don\'t worry - you\'re safe here with me.' }
        ]
    },

    'mama_good': {
        lines: [
            { speaker: 'mama', text: 'That\'s it! You\'re doing wonderfully.' },
            { speaker: 'mama', text: 'You\'ll be hopping all over the nest in no time.' }
        ]
    },

    'mama_siblings': {
        lines: [
            { speaker: 'mama', text: 'See those little ones beside you?' },
            { speaker: 'mama', text: 'That\'s Wren, your older sister. And Bramble, your brother.' },
            { speaker: 'mama', text: 'They hatched just before you. Let them rest for now.' }
        ]
    },

    'mama_rest': {
        lines: [
            { speaker: 'mama', text: 'The world outside is vast, Pip. Full of wonders... and dangers.' },
            { speaker: 'mama', text: 'But you\'re not ready for that yet. None of you are.' },
            { speaker: 'mama', text: 'For now, rest. Grow strong.' },
            { speaker: 'mama', text: 'Your father will return soon with food.' }
        ]
    },

    // DAY 1 - FEEDING

    'papa_arrives': {
        lines: [
            { speaker: 'narrator', text: 'A shadow passes over the nest. But this one is familiar.' },
            { speaker: 'papa', text: 'I\'m back! And look what I found.' },
            { speaker: 'mama', text: 'The little one hatched while you were gone.' },
            { speaker: 'papa', text: 'Pip! Let me look at you.' },
            { speaker: 'papa', text: '...You have your mother\'s eyes.' }
        ]
    },

    'papa_food': {
        lines: [
            { speaker: 'papa', text: 'You must be hungry. Here - your first meal.' },
            { speaker: 'papa', text: 'Move close to it and press SPACE to eat.' },
            { speaker: 'mama', text: 'Eating helps you grow stronger, little one.' }
        ]
    },

    'papa_good': {
        lines: [
            { speaker: 'papa', text: 'That\'s my Pip! Eat up. You\'ll need your strength.' },
            { speaker: 'mama', text: 'Soon you\'ll be catching your own food.' },
            { speaker: 'pip', text: '(You feel a little stronger already.)' }
        ]
    },

    'papa_warning': {
        lines: [
            { speaker: 'papa', text: '...The forest was quiet today. Too quiet.' },
            { speaker: 'mama', text: 'Not now. Not in front of the children.' },
            { speaker: 'papa', text: 'You\'re right. I\'m sorry.' },
            { speaker: 'papa', text: 'Rest now, little ones. Tomorrow, we begin your lessons.' }
        ]
    },

    // DAY 1 - SIBLINGS

    'siblings_wake': {
        lines: [
            { speaker: 'narrator', text: 'Movement in the nest. Your siblings are stirring.' },
            { speaker: 'bramble', text: '*yaaawn* Is it morning already?' },
            { speaker: 'wren', text: 'Shh, Bramble. Look - Pip hatched!' }
        ]
    },

    'wren_intro': {
        lines: [
            { speaker: 'wren', text: 'Hey there, little one. I\'m Wren, your big sister.' },
            { speaker: 'wren', text: 'Well... bigger by a few hours anyway.' },
            { speaker: 'wren', text: 'Don\'t worry. I\'ll show you everything I know.' },
            { speaker: 'wren', text: 'Which is... not much yet. But still!' }
        ]
    },

    'bramble_intro': {
        lines: [
            { speaker: 'bramble', text: 'I\'m BRAMBLE! And I\'m gonna be the BEST flyer ever!' },
            { speaker: 'wren', text: 'You can\'t even fly yet, Bramble.' },
            { speaker: 'bramble', text: 'Details! I can feel it in my wings!' },
            { speaker: 'bramble', text: 'Hey Pip - wanna race?!' }
        ]
    },

    'bramble_challenge': {
        lines: [
            { speaker: 'bramble', text: 'First one to the other side of the nest wins!' },
            { speaker: 'wren', text: 'Pip just hatched! That\'s not fair!' },
            { speaker: 'bramble', text: 'Fair schmair! Ready... set...' },
            { speaker: 'bramble', text: 'GO!' }
        ]
    },

    'race_result': {
        lines: [
            { speaker: 'bramble', text: 'Whoa! You\'re fast for a newborn!' },
            { speaker: 'wren', text: 'I told you Pip was special.' },
            { speaker: 'bramble', text: 'Next time I\'ll win for sure! Just you wait!' },
            { speaker: 'mama', text: 'Alright little ones, settle down. Night is coming.' }
        ]
    },

    // DAY 1 - NIGHT

    'night_falls': {
        lines: [
            { speaker: 'narrator', text: 'The sky turns orange, then purple, then deep blue.' },
            { speaker: 'narrator', text: 'Stars appear, one by one, like tiny distant suns.' },
            { speaker: 'narrator', text: 'Your family gathers close together for warmth.' }
        ]
    },

    'mama_lullaby': {
        lines: [
            { speaker: 'mama', text: 'Sleep now, little ones. Dream of open skies.' },
            { speaker: 'mama', text: '♪ High above the forest deep... ♪' },
            { speaker: 'mama', text: '♪ Safe within our nest we sleep... ♪' },
            { speaker: 'mama', text: '♪ When the morning sun does rise... ♪' },
            { speaker: 'mama', text: '♪ We\'ll spread our wings and touch the skies... ♪' },
            { speaker: 'narrator', text: 'Your eyes grow heavy. Warmth surrounds you.' }
        ]
    },

    'papa_watches': {
        lines: [
            { speaker: 'narrator', text: 'But as you drift off, you notice...' },
            { speaker: 'narrator', text: 'Papa isn\'t sleeping. He watches the dark sky.' },
            { speaker: 'narrator', text: 'His eyes follow something you cannot see.' },
            { speaker: 'narrator', text: 'Something in the darkness, circling.' },
            { speaker: 'papa', text: '...' }
        ]
    },

    // =====================
    // DAY 2 - MORNING
    // =====================

    'day2_wake': {
        lines: [
            { speaker: 'narrator', text: 'Light filters through the leaves.' },
            { speaker: 'narrator', text: 'A new day begins.' },
            { speaker: 'bramble', text: 'Wake up wake up wake up!' },
            { speaker: 'wren', text: 'Ugh, Bramble, the sun just came up...' },
            { speaker: 'mama', text: 'Good morning, little ones. Today is an important day.' }
        ]
    },

    'mama_stretch': {
        lines: [
            { speaker: 'mama', text: 'Today, we start training those wings.' },
            { speaker: 'mama', text: 'You can\'t fly yet - your feathers need to grow.' },
            { speaker: 'mama', text: 'But we can make your wing muscles strong!' },
            { speaker: 'mama', text: 'Hold SPACE to stretch your wings. Feel them grow stronger.' }
        ]
    },

    'stretch_done': {
        lines: [
            { speaker: 'mama', text: 'Wonderful! I can already see them getting stronger.' },
            { speaker: 'bramble', text: 'When can we actually FLY though?!' },
            { speaker: 'mama', text: 'Patience, Bramble. A few more days.' },
            { speaker: 'mama', text: 'Flying before you\'re ready is... dangerous.' },
            { speaker: 'wren', text: 'Mama? Is something wrong?' },
            { speaker: 'mama', text: 'No, dear. Nothing\'s wrong. Let\'s get some breakfast.' }
        ]
    },

    // DAY 2 - COMPETITION

    'papa_food_2': {
        lines: [
            { speaker: 'papa', text: 'Breakfast time! I found some bugs near the meadow.' },
            { speaker: 'bramble', text: 'FOOD!' },
            { speaker: 'papa', text: 'There\'s plenty for everyone. But let\'s make it fun.' },
            { speaker: 'papa', text: 'See how many you can catch!' }
        ]
    },

    'feeding_done': {
        lines: [
            { speaker: 'papa', text: 'Well done, all of you! Getting faster every day.' },
            { speaker: 'wren', text: 'Papa, can we see the edge of the nest today?' },
            { speaker: 'papa', text: '...Just the edge. And stay close to each other.' }
        ]
    },

    // DAY 2 - THE EDGE

    'wren_edge': {
        lines: [
            { speaker: 'wren', text: 'Come on, Pip! Come see!' },
            { speaker: 'wren', text: 'Hop over to the edge of the nest with me.' }
        ]
    },

    'wren_someday': {
        lines: [
            { speaker: 'narrator', text: 'You look out from the edge of the nest.' },
            { speaker: 'narrator', text: 'The world stretches out before you. Endless.' },
            { speaker: 'narrator', text: 'Trees as far as you can see. Mountains in the distance.' },
            { speaker: 'narrator', text: 'A pond glitters in the sunlight. Birds dot the sky.' },
            { speaker: 'wren', text: 'Someday... we\'ll go out there.' },
            { speaker: 'wren', text: 'We\'ll fly through those trees. See what\'s beyond the mountains.' }
        ]
    },

    'bramble_tomorrow': {
        lines: [
            { speaker: 'bramble', text: 'I\'m gonna fly TOMORROW! You\'ll see!' },
            { speaker: 'wren', text: 'Bramble, no. We\'re not ready.' },
            { speaker: 'bramble', text: 'You\'re not ready! I can feel my wings are strong enough!' }
        ]
    },

    'mama_patience': {
        lines: [
            { speaker: 'mama', text: 'Bramble. Come away from the edge.' },
            { speaker: 'mama', text: 'Flying takes more than strong wings.' },
            { speaker: 'mama', text: 'It takes practice. Patience. And knowing when you\'re ready.' },
            { speaker: 'mama', text: 'Promise me. Promise me you\'ll wait.' },
            { speaker: 'bramble', text: '...Fine. I promise.' }
        ]
    },

    // DAY 2 - THE SHADOW

    'shadow_passes': {
        lines: [
            { speaker: 'narrator', text: 'A shadow passes over the nest.' },
            { speaker: 'narrator', text: 'Large. Silent. Circling.' },
            { speaker: 'narrator', text: 'The world seems to darken.' }
        ]
    },

    'papa_shield': {
        lines: [
            { speaker: 'papa', text: 'DOWN! Everyone down! Under my wing!' },
            { speaker: 'narrator', text: 'Papa spreads his wings over you all.' },
            { speaker: 'narrator', text: 'Through the feathers, you glimpse it.' },
            { speaker: 'narrator', text: 'A great bird. Red tail. Sharp talons. Searching.' },
            { speaker: 'wren', text: '*whimpering*' },
            { speaker: 'mama', text: 'Shh. Don\'t move. Don\'t make a sound.' }
        ]
    },

    'shadow_gone': {
        lines: [
            { speaker: 'narrator', text: 'Seconds stretch into eternity.' },
            { speaker: 'narrator', text: 'Then... the shadow passes. The sky brightens.' },
            { speaker: 'papa', text: '...It\'s gone. For now.' },
            { speaker: 'bramble', text: 'What... what was that?' }
        ]
    },

    'parents_look': {
        lines: [
            { speaker: 'narrator', text: 'Your parents exchange a look.' },
            { speaker: 'narrator', text: 'A look heavy with meaning. With memory. With fear.' },
            { speaker: 'mama', text: 'Nothing you need to worry about, little ones.' },
            { speaker: 'papa', text: 'Just a... passing bird. Nothing more.' },
            { speaker: 'wren', text: 'You\'re lying. I can tell.' },
            { speaker: 'mama', text: '...Come. Let\'s go back to the center of the nest.' }
        ]
    },

    // DAY 2 - ASHER

    'asher_arrives': {
        lines: [
            { speaker: 'narrator', text: 'As evening approaches, a dark shape lands on a nearby branch.' },
            { speaker: 'narrator', text: 'A crow. Old. Ragged. One eye that seems to see too much.' },
            { speaker: 'papa', text: 'Asher.' }
        ]
    },

    'papa_defensive': {
        lines: [
            { speaker: 'papa', text: 'What do you want, crow?' },
            { speaker: 'asher', text: 'Such hostility. And here I came to give a warning.' },
            { speaker: 'papa', text: 'We don\'t need your warnings. Or your prophecies.' }
        ]
    },

    'mama_calm': {
        lines: [
            { speaker: 'mama', text: 'Wait. Let him speak.' },
            { speaker: 'asher', text: 'Hmm. The mother, at least, has wisdom.' }
        ]
    },

    'asher_speaks': {
        lines: [
            { speaker: 'asher', text: 'The little ones grow fast, I see.' },
            { speaker: 'asher', text: 'Faster than most. That one especially.' },
            { speaker: 'narrator', text: 'His eye fixes on you.' },
            { speaker: 'asher', text: 'Something different about you, little hatchling.' },
            { speaker: 'asher', text: 'Something... old.' }
        ]
    },

    'asher_cryptic': {
        lines: [
            { speaker: 'asher', text: 'Talon has returned to the valley.' },
            { speaker: 'papa', text: '...We know.' },
            { speaker: 'asher', text: 'Do you? Do you truly understand what that means?' },
            { speaker: 'asher', text: 'He remembers this tree. He remembers what he took.' },
            { speaker: 'asher', text: 'And he will come for what remains.' },
            { speaker: 'asher', text: 'Teach them fast, robin. Time is not your friend.' },
            { speaker: 'narrator', text: 'With that, the old crow spreads his tattered wings.' },
            { speaker: 'narrator', text: 'And disappears into the fading light.' }
        ]
    },

    'mama_dismiss': {
        lines: [
            { speaker: 'wren', text: 'Mama... what did he mean? What did Talon take?' },
            { speaker: 'mama', text: 'Nothing, sweetheart. Old Asher is... troubled.' },
            { speaker: 'mama', text: 'He\'s seen too much. He sees danger everywhere.' },
            { speaker: 'mama', text: 'Don\'t let his words frighten you.' },
            { speaker: 'bramble', text: 'I\'m not scared! I\'ll fight any hawk!' },
            { speaker: 'papa', text: '...Let\'s get some rest. Tomorrow is another day.' }
        ]
    },

    // DAY 2 - NIGHT

    'night2_falls': {
        lines: [
            { speaker: 'narrator', text: 'Night falls once more.' },
            { speaker: 'narrator', text: 'The nest feels smaller tonight. The darkness, deeper.' },
            { speaker: 'narrator', text: 'Your siblings huddle close. Even Bramble is quiet.' }
        ]
    },

    'papa_awake': {
        lines: [
            { speaker: 'narrator', text: 'As sleep takes you, one last image remains.' },
            { speaker: 'narrator', text: 'Papa, silhouetted against the stars.' },
            { speaker: 'narrator', text: 'Standing guard. Watching the darkness.' },
            { speaker: 'narrator', text: 'Waiting for something that may or may not come.' },
            { speaker: 'narrator', text: 'But one thing is certain now.' },
            { speaker: 'narrator', text: 'You need to learn to fly.' },
            { speaker: 'narrator', text: 'And soon.' }
        ]
    }
};
