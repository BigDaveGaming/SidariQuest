/* ---------- LESSON 1 SCRIPT ---------- */
const FINAL_APPROACH=[
  ["Dave","Look at that, Shaz. We're nearly there!"],
  ["Sharon","Hang on, Dave. I've got one question left."],
  ["Dave","You've been on that thing the whole flight."],
  ["Sharon","It's called learning Greek, luv. I've got a 187-day streak."],
  ["Dave","Well, I've got a better idea. Fella down the pub reckons if you speak Greek, you get local prices. Half what the tourists pay."],
  ["Sharon","Well, obviously. That's why I've been learning it."],
  ["Dave","Go on, then. Say something."],
  ["Sharon","Η χελώνα τρώει φράουλες.",true],
  ["Dave","What's that?"],
  ["Sharon","The turtle eats strawberries."],
  ["Dave","Sound. Ask the turtle where we get cheap beer."],
  ["Sharon","At least I can speak it. What do you know?"],
  ["Dave","Kalimari."],
  ["Sharon","That's squid, Dave."],
  ["Dave","See? We'll never starve."],
  ["","The plane banks over the water towards the runway."],
  ["Dave","Anyway, I've sorted us out. Three hundred quid a week, Shaz. All-inclusive. For the whole summer. I've still got it."],
  ["Sharon","You'd better have, Dave."],
  ["","Sharon returns to her phone. Dave grins out of the window. They're here for a long summer holiday in Corfu."]
];

const CHAPTER={
  id:"chapter1",
  steps:[
    {id:"legacy-0",t:"cutscene",scene:"landing",lines:FINAL_APPROACH},
    {id:"legacy-1",t:"narr",scene:"baggage",text:{m:"The carousel makes one last turn. Dave’s case appears. Two pairs of shorts, one shirt and enough van magnets to rebrand the entire airport. Sharon reckons all those Duolingo sessions in the bath have prepared her for whatever comes next.",f:"The carousel makes one last turn. Sharon grabs the case. If Duolingo in the bath has taught her one thing, it’s that she’s definitely ready for this."}},
    {id:"legacy-2",t:"narr",scene:"arrivals",text:"The rep points to the transfer coach. Dave eyes the queue and heads for the hire office. Sharon follows. Someone has to read the paperwork."},
    {id:"legacy-3",t:"narr",scene:"van",wide:true,text:"Corfu Airport. 35°C. A white van sits outside the hire office. Dave booked it months ago and brought the magnets. Sharon has a battered Greek for Beginners phrasebook from the airport. Dave has already scribbled “ASK FOR LOCAL PRICE” in it."},
    {id:"legacy-4",t:"q",kind:"sign",sign:"ΕΝΟΙΚΙΑΣΕΙΣ ΑΥΤΟΚΙΝΗΤΩΝ",prompt:"What does the sign say?",
      opts:[{en:"Car hire",ok:1},{en:"Car park"},{en:"Car wash"}],
      why:"ενοικιάσεις = rentals, αυτοκινήτων = of cars. You'll see this sign all over Corfu.",
      badOptions:[{m:"Dave lines up the suitcase between two painted bays. Spyros asks if it needs a parking ticket.",f:"Sharon asks for a parking ticket. Spyros looks down at Dave’s suitcase and asks how long he’ll be staying."},{m:"Dave holds up the keys to his car back in England. Spyros offers him a very small sponge.",f:"Sharon asks if they do upholstery. Spyros points her to the van’s previous renter, who is still hoovering it."}],
      learn:["Ενοικιάσεις αυτοκινήτων","Car hire"]},
    {id:"legacy-5",t:"me",text:{m:"ALRIGHT MATE! I… WANT… A… VAN!",f:"HIYA, LUV! WE… WANT… A… VAN!"}},
    {id:"legacy-6",t:"local",gr:"Καλημέρα.",en:"Good morning."},
    {id:"legacy-7",t:"q",kind:"reply",prompt:"Greet him back properly:",
      opts:[{gr:"Καλημέρα!",en:"Good morning!",ok:1},{gr:"Καληνύχτα!",en:"Good night!"},{gr:"Γεια μας!",en:"Cheers!"},{gr:"Καλή όρεξη!",en:"Enjoy your meal!",exchange:{
        m:[["Spyros","Thank you. But I am not eating."],["Sharon","He's trying to hire a van, not feed you, luv."],["Dave","Just being polite, weren't I?"]],
        f:[["Spyros","Thank you. But I am not eating."],["Dave","He's got a point, Shaz. Unless the clipboard's edible."],["Sharon","Oh, shut up, Dave. I'm learning."]]} }],
      why:"Καλημέρα until about midday, then καλησπέρα (good afternoon/evening). Καληνύχτα is only for bedtime.",
      badOptions:[{m:"Dave waves goodbye. Spyros turns the OPEN sign around to check what it says.",f:"Spyros wishes Sharon sweet dreams. She has been up since three, so for a second she considers it."},{m:"Dave lifts an imaginary pint. Spyros lifts the stapler.",f:"Sharon raises her iced coffee. Spyros clinks it with his pen."}],
      learn:["Καλημέρα","Good morning"]},
    {id:"legacy-8",t:"local",gr:"Έχετε κάνει κράτηση;",en:"Have you made a booking?"},
    {id:"legacy-9",t:"q",kind:"reply",prompt:"Answer him:",
      opts:[{gr:"Ναι, έχω κράτηση στο όνομα {PG}.",en:"Yes, I have a booking under {P}.",ok:1},{gr:"Όχι, είμαι από την Αγγλία.",en:"No, I'm from England."},{gr:"Ναι, έναν φραπέ.",en:"Yes, a frappé."}],
      why:"Στο όνομα… = in the name of… Give the surname on the booking. This works at hotels and restaurants too.",
      badOptions:[{m:"Spyros starts looking for England in the booking system. Dave takes that as a sign they’ve got a branch there.",f:"Sharon opens her map. Spyros turns his clipboard around and taps the box marked NAME."},{m:"Spyros hands Dave a paper cup. Dave asks if it comes with a spare tyre.",f:"Spyros hands Sharon a coffee loyalty card. The van keys stay in the drawer."}],
      learn:["Στο όνομα…","In the name of…"]},
    {id:"legacy-10",t:"build",prompt:"Spyros offers a small car instead. Tell him you’d like a van.",answer:"Θα ήθελα ένα βαν",extra:["θέλω","αυτοκίνητο"],
      why:"Θα ήθελα = I would like. Politer than θέλω (I want). Greeks use the English word βαν.",
      learn:["Θα ήθελα ένα βαν","I'd like a van"]},
    {id:"legacy-11",t:"q",kind:"meaning",gr:"Για πόσες μέρες;",prompt:"What is Spyros asking?",
      opts:[{en:"For how many days?",ok:1},{en:"How many people?"},{en:"How much money have you got?"}],
      why:"πόσες = how many, μέρες = days.",
      badOptions:[{m:"Dave counts himself twice before Spyros taps the calendar.",f:"Sharon starts counting suitcases as passengers. Spyros pulls out the calendar."},{m:"Dave checks his wallet. Spyros points at the calendar, which is free.",f:"Sharon keeps her purse firmly shut. Spyros points at his desk calendar."}],
      learn:["Για πόσες μέρες;","For how many days?"]},
    {id:"legacy-12",t:"q",kind:"reply",prompt:"Tell him you need it until September:",
      opts:[{gr:"Μέχρι τον Σεπτέμβριο.",en:"Until September.",ok:1},{gr:"Στις τέσσερις.",en:"At four o'clock."},{gr:"Τέσσερα ευρώ.",en:"Four euros."}],
      why:"μέχρι = until. Spyros's eyes light up. A whole summer of rental!",
      badOptions:[{m:"Spyros writes FOUR O’CLOCK on a sticky note. Dave now has three hours to get his luggage out of the van.",f:"Spyros sets an alarm for four. Sharon cancels it before he can stick it on the dashboard."},{m:"Spyros offers Dave a toy van from the windowsill. The doors don’t open.",f:"Spyros checks the vending machine. Four euros could get them two waters and the walk to Sidari."}],
      learn:["Μέχρι τον Σεπτέμβριο","Until September"]},
    {id:"legacy-13",t:"q",kind:"reply",prompt:"Ask what the van costs per month.",
      opts:[{gr:"Πόσο κοστίζει τον μήνα;",en:"How much does it cost per month?",ok:1},{gr:"Πόσες μέρες τον μήνα;",en:"How many days per month?"},{gr:"Πού είναι το βαν;",en:"Where is the van?"}],
      why:"Πόσο κοστίζει; = How much does it cost? Τον μήνα = per month.",
      badOptions:[{m:"Spyros turns his calendar to May. Dave asks if the extra day is included.",f:"Spyros checks his calendar. Sharon taps the empty price box to get him back on the subject."},{m:"Spyros points outside. Dave is half out the door before he remembers the price.",f:"Sharon gets a view of the van. None of its dents has a price tag."}],
      learn:["Πόσο κοστίζει τον μήνα;","How much does it cost per month?"]},
    {id:"legacy-14",t:"q",kind:"meaning",gr:"Εξακόσια ευρώ τον μήνα.",prompt:"How much is it?",
      opts:[{en:"€600 a month",ok:1},{en:"€60 a month"},{en:"€600 a week"}],
      why:"εξακόσια = six hundred, τον μήνα = per month.",
      good:"Correct. Same price for everyone, says Spyros. {P} is not happy about it.",reaction:"shocked",
      badOptions:[{m:"Dave starts counting out three twenties. Spyros slides one extra zero across the desk.",f:"Sharon almost tells Dave he’s found a bargain. She stops just in time."},{m:"Dave starts calculating whether it’s cheaper to buy the van. Spyros taps the monthly column.",f:"Sharon starts dividing the bill by four. Spyros quietly moves her calculator off the weekly column."}],
      learn:["Τον μήνα","Per month"]},
    {id:"legacy-15",t:"local",gr:"Το δίπλωμα και το διαβατήριο, παρακαλώ.",en:"Your driving licence and passport, please."},
    {id:"legacy-16",t:"q",kind:"reply",prompt:"Hand them over. What do you say?",
      opts:[{gr:"Ορίστε.",en:"Here you are.",ok:1},{gr:"Καλή όρεξη.",en:"Enjoy your meal."},{gr:"Δεν πειράζει.",en:"Never mind."}],
      why:"Ορίστε = here you are. It also means 'Pardon?' and it's how Greeks answer the phone.",
      badOptions:[{m:"Spyros checks the passport for a menu. Dave realises he’s holding it upside down.",f:"Spyros looks down at his sandwich. Sharon has accidentally timed that perfectly."},{m:"Spyros puts the keys back in the drawer. Dave remembers he does, in fact, mind.",f:"Spyros closes the rental folder. Sharon has to catch it before he files it away."}],
      learn:["Ορίστε","Here you are"]},
    {id:"legacy-17",t:"local",gr:"Ευχαριστώ. Είστε έτοιμοι;",en:"Thank you. Are you ready?"},
    {id:"legacy-18",t:"q",kind:"say",prompt:"Say: I'm ready!",
      opts:[{gr:{m:"Είμαι έτοιμος!",f:"Είμαι έτοιμη!"},en:"I'm ready!",ok:1},
            {gr:{m:"Είμαι έτοιμη!",f:"Είμαι έτοιμος!"},en:{m:"I'm ready! (woman's form)",f:"I'm ready! (man's form)"}},
            {gr:{m:"Είμαι κουρασμένος!",f:"Είμαι κουρασμένη!"},en:"I'm tired!"}],
      why:{m:"έτοιμος is the man's form. Sharon would say έτοιμη.",f:"έτοιμη is the woman's form. Dave would say έτοιμος."},
      badOptions:[{m:"Spyros holds the keys out to Sharon. Dave puts his hand up like he’s back at school.",f:"Spyros holds the keys out to Dave. Sharon intercepts them with one eyebrow."},{m:"Spyros offers Dave the chair. It’s the first thing Dave’s negotiated successfully all morning.",f:"Spyros points Sharon to a chair. She hands Dave the cases and takes the offer."}],
      learn:[{m:"Είμαι έτοιμος",f:"Είμαι έτοιμη"},"I'm ready"]},
    {id:"legacy-19",t:"narr",prop:"magnet",text:"Dave holds up his Union Jack magnets. A minute later there’s one on each van door."},
    {id:"legacy-20",t:"q",kind:"meaning",gr:"Προσέξτε το βαν, σας παρακαλώ!",prompt:"What did Spyros just say?",
      opts:[{en:"Please be careful with the van!",ok:1},{en:"Please bring it back with a full tank!"},{en:"Please park it over there!"}],
      why:"Προσέξτε = be careful, watch out. On signs you'll see ΠΡΟΣΟΧΗ (caution).",
      badOptions:[{m:"Dave asks where the petrol cap is. Spyros points to a dent he hasn’t marked yet.",f:"Sharon asks about petrol. Spyros points to the wing mirror, which Dave just folded backwards."},{m:"Dave reaches for reverse. Spyros takes two large steps back.",f:"Sharon points Dave into a bay. Spyros retrieves the office sandwich board before Dave can park on it."}],
      learn:["Προσέξτε!","Be careful!"]},
    {id:"legacy-21",t:"me",text:{m:"Don't worry, Spyros mate. I've been driving vans for thirty years.",f:"Don't worry, luv. Dave's been driving vans for thirty years."}},
    {id:"legacy-22",t:"narr",scene:"apartment",wide:true,text:"They pull up in Sidari. Kyria Eleni has the keys. Kyrios Spyros has an inventory. Dave has a napkin already tucked into his collar."},
    {id:"legacy-23",t:"local",speaker:"Kyria Eleni",gr:"Καλώς ήρθατε!",en:"Welcome!"},
    {id:"legacy-25",t:"local",speaker:"Kyrios Spyros",gr:"Ορίστε τα κλειδιά. Το διαμέρισμα είναι στον πρώτο όροφο.",en:"Here are the keys. The apartment is on the first floor."},
    {id:"legacy-26",t:"q",kind:"reply",speaker:"Kyrios Spyros",prompt:"Thank the landlord politely by name.",
      opts:[{gr:"Ευχαριστώ, κύριε Σπύρο.",en:"Thank you, Mr Spyros.",ok:1},{gr:"Παρακαλώ, κύριε Σπύρο.",en:"You're welcome, Mr Spyros."},{gr:"Ευχαριστώ, κυρία Ελένη.",en:"Thank you, Ms Eleni."}],
      why:"Ευχαριστώ means thank you. Say κύριε Σπύρο when addressing Mr Spyros. Κυρία Ελένη is how you address Ms Eleni.",
      badOptions:[{m:"Spyros thanks Dave back. For a moment Dave thinks he’s the one handing over the apartment.",f:"Spyros thanks Sharon back. She realises she has skipped straight to ‘you’re welcome’."},{m:"Eleni takes a little bow. Spyros is still standing there with the inventory.",f:"Eleni says ‘You’re welcome’ from the doorway. Sharon turns back to the man holding the keys."}],
      learn:["Ευχαριστώ, κύριε Σπύρο.","Thank you, Mr Spyros."]},
    {id:"legacy-24",t:"q",kind:"reply",prompt:"Ask what time breakfast is.",
      opts:[{gr:"Τι ώρα είναι το πρωινό;",en:"What time is breakfast?",ok:1},{gr:"Πού είναι η παραλία;",en:"Where is the beach?"},{gr:"Τι ώρα είναι;",en:"What time is it?"}],
      why:"Πρωινό is breakfast. Τι ώρα είναι…; asks what time something is.",
      replies:["Down the road. Were you thinking of having breakfast there?","It's ten. Were you asking about breakfast?"],
      badOptions:[{m:"Dave checks whether the beach has a buffet.",f:"Sharon wonders if breakfast comes with a sunbed."},{m:"Dave looks around for the breakfast queue.",f:"Sharon asks Dave why he brought a watch."}],
      learn:["Τι ώρα είναι το πρωινό;","What time is breakfast?"]},
    {id:"no-breakfast",t:"local",gr:"Δεν έχει πρωινό.",en:"There's no breakfast."},
    {id:"dinner",t:"q",kind:"reply",prompt:"Ask about dinner instead.",
      opts:[{gr:"Και το βραδινό;",en:"And dinner?",ok:1},{gr:"Και το πρωινό;",en:"And breakfast?"},{gr:"Ένα ποτήρι κρασί, παρακαλώ.",en:"A glass of wine, please."}],
      why:"Βραδινό is the evening meal. Και means and.",
      replies:["Still no breakfast, I'm afraid.","There's a glass in the cupboard."],
      badOptions:[{m:"Dave thought the answer might change if he asked twice.",f:"Sharon was hoping Eleni had a secret breakfast menu."},{m:"Dave calls it a sensible starter.",f:"Sharon says it was worth a try, luv."}],
      learn:["Και το βραδινό;","And dinner?"]},
    {id:"legacy-27",t:"narr",scene:"kitchen",wide:true,text:"Eleni opens the door. Two rings, a kettle and an empty fridge."},
    {id:"kitchen-reveal",t:"local",gr:"Έχει κουζίνα!",en:"There's a kitchen!"},
    {id:"booking-reveal",t:"me",reaction:"fuming",text:{m:"Sharon checks the booking. “It says self-catering, Dave. In bold. Next to the picture of the kettle.” Dave stares at the empty fridge. “Three hundred quid and I've got to make me own toast?”",f:"Sharon reads the booking to Dave. “Self-catering, Dave. In bold. Next to the picture of the kettle.” Dave fumes. Sharon opens the fridge. “I was promised breakfast too, luv.”"}},
    {id:"legacy-28",t:"q",kind:"reply",prompt:"Ask Eleni where the mini-market is.",
      opts:[{gr:"Πού είναι το μίνι μάρκετ;",en:"Where is the mini-market?",ok:1},{gr:"Πού είναι το αεροδρόμιο;",en:"Where is the airport?"},{gr:"Πού είναι το μενού;",en:"Where is the menu?"}],
      why:"Πού είναι…; means “Where is…?” Το αεροδρόμιο is the airport. Το μενού is the menu.",
      badOptions:[{m:"Dave’s had one look at the empty fridge and is already pricing flights home.",f:"Eleni points back towards the airport. Sharon puts the hire keys safely back in her bag."},{m:"Eleni hands Dave the instruction leaflet for the hob. Page two has diagrams.",f:"Sharon taps the table like she’s waiting for service. Eleni hands her a shopping bag."}],
      learn:["Πού είναι το μίνι μάρκετ;","Where is the mini-market?"]},
    {id:"legacy-29",t:"local",speaker:"Kyria Eleni",gr:"Στο τέλος του δρόμου, δεξιά.",en:"At the end of the road, on the right."},
    {id:"legacy-30",t:"narr",scene:"market",wide:true,text:"Behind the till sits another Spyros. Dave is still holding out for his imaginary local price. Sharon reckons a full sentence will clinch it. Spyros just wants to know what they’re buying."},
    {id:"legacy-31",t:"q",kind:"reply",prompt:"Ask for a bottle of water, please.",
      opts:[{gr:"Ένα μπουκάλι νερό, παρακαλώ.",en:"A bottle of water, please.",ok:1},{gr:"Ένα ποτήρι κρασί, παρακαλώ.",en:"A glass of wine, please."},{gr:"Μια σακούλα, παρακαλώ.",en:"A bag, please."}],
      why:"Ένα μπουκάλι νερό is a bottle of water. Ένα ποτήρι κρασί is a glass of wine. Μια σακούλα is a bag. Παρακαλώ makes the request polite.",
      badOptions:[{m:"Spyros reaches for a glass. Dave looks at the van keys and slides the glass back.",f:"Sharon has accidentally ordered the evening to start at eleven in the morning."},{m:"Spyros hands Dave a bag. Dave squints at it. It doesn’t look very thirst-quenching.",f:"Spyros hands Sharon a bag. She has now successfully bought somewhere to put the water."}],
      learn:["Ένα μπουκάλι νερό, παρακαλώ.","A bottle of water, please."]},
    {id:"legacy-32",t:"q",kind:"reply",prompt:"Ask how much the bottle costs.",
      opts:[{gr:"Πόσο κάνει;",en:"How much is it?",ok:1},{gr:"Τι ώρα είναι;",en:"What time is it?"},{gr:"Μπορώ να πληρώσω με κάρτα;",en:"Can I pay by card?"}],
      why:"Πόσο κάνει; asks the price of one item. Τι ώρα είναι; asks the time. Μπορώ να πληρώσω με κάρτα; asks if you can pay by card.",
      badOptions:[{m:"Spyros checks the clock. Dave briefly thinks the water costs eleven fifty.",f:"Spyros tells Sharon the time. She’s been two hours early for everything since they landed."},{m:"Spyros wakes up the card reader. Dave still wants to know what he’s agreeing to.",f:"Spyros holds up the card reader. Sharon reaches for her card, then remembers the small matter of the price."}],
      learn:["Πόσο κάνει;","How much is it?"]},
    {id:"legacy-33",t:"local",speaker:"Fat Spyros",gr:"Ογδόντα λεπτά.",en:"Eighty cents."},
    {id:"legacy-34",t:"narr",scene:"apartment",text:{m:"Back at the apartment, Eleni brings figs. Dave puts them on a plate and calls it his first all-inclusive dinner. Sharon points out that he’s doing the washing up.",f:"Eleni brings figs. Sharon cracks open the water and takes the first fig. Dave asks what’s for breakfast. “Whatever you cook, luv.”"}}
  ]
};

// Stable phrase IDs are shared by cards, story hints and the chapter challenge.
const PHRASE_GROUPS = {
  "legacy-4": [
    ["sign", "legacy-4", "rentals|of cars"],
    ["morning", "legacy-7", "good morning"],
    ["booking", "legacy-9", "yes|I have|booking|in the|name|name on the booking"]
  ],
  "legacy-10": [
    ["van", "legacy-10", "would|I like|a|van"],
    ["days", "legacy-11", "for|how many|days"],
    ["september", "legacy-12", "until|the|September"]
  ],
  "legacy-13": [
    ["van-price", "legacy-13", "how much|does it cost|per|month"],
    ["monthly-charge", "legacy-14", "six hundred|euros|per|month"],
    ["handover", "legacy-16", "here you are"]
  ],
  "legacy-17": [
    ["ready", "legacy-18", "I am|ready"],
    ["careful", "legacy-20", "be careful with|the|van|you (polite)|please"]
  ],
  "legacy-24": [
    ["breakfast", "legacy-24", "what|time|is|the|breakfast"],
    ["dinner", "dinner", "and|the|dinner"],
    ["kitchen", "kitchen-reveal", "there is|kitchen", "Κουζίνα can mean the kitchen or the cooking style."]
  ],
  "legacy-26": [
    ["thank", "legacy-26", "thank you|Mr|Spyros"],
    ["directions", "legacy-28", "where|is|the|mini|market"]
  ],
  "legacy-31": [
    ["water", "legacy-31", "one|bottle|water|please"],
    ["price", "legacy-32", "how much|does it cost"]
  ]
};

const LOCAL_REPLIES = {
  "legacy-4":["Car hire. You can park once you've got a car.","We rent them. We don't wash them while you wait."],
  "legacy-7":["Good night? I've only just opened.","Cheers. Now, did you book a van?"],
  "legacy-9":["From England, yes. What name is on the booking?","The café is next door."],
  "legacy-11":["People later. How many days first.","We'll get to the money. Tell me the dates."],
  "legacy-12":["Four o’clock today? I thought you wanted it for the summer.","Four euros? I think you’re looking at the wrong price list."],
  "legacy-13":["You can have it every day. That's what monthly hire means.","Right outside, by the door."],
  "legacy-14":["Six hundred. There’s another zero.","That’s the price for a month."],
  "legacy-16":["Thank you. Those are very good-looking documents.","I still need to see your licence."],
  "legacy-18":["Which of you is taking the keys?","You can sit down if you need to."],
  "legacy-20":["We can talk about petrol later. I’m asking you to take care of it.","No, you can take it. Just be careful."],
  "legacy-26":["You're welcome. I think that's what I was going to say.","Eleni's in the doorway. I'm Spyros."],
  "legacy-28":["Back the way you came. Why, have you forgotten something?","There’s no menu here. Try the mini-market down the road."],
  "legacy-31":["Wine? I thought you wanted something for the road.","Of course. What would you like to put in it?"],
  "legacy-32":["It's ten past eleven.","Yes. Would you like to know the price first?"]
};

const PHRASES = {};
const STORY_STEPS = CHAPTER.steps.flatMap(step => {
  step.replies ||= LOCAL_REPLIES[step.id];
  const cards = (PHRASE_GROUPS[step.id] || []).map(([id, source, gloss, tip]) => {
    const original = CHAPTER.steps.find(item => item.id === source);
    const correct = original.opts?.find(option => option.ok);
    const card = {
      id: "teach-" + id, phrase: id, t: "teach",
      gr: original.sign ? original.learn[0] : original.gr || original.answer || correct?.gr,
      sign: original.sign,
      en: original.en || correct?.en || original.learn[1],
      words: gloss.split("|"), tip: tip || original.why
    };
    PHRASES[id] = card;
    original.phrase = id;
    return card;
  });
  return [...cards, step];
});

const CHALLENGE = [
  {id:"challenge-handover", t:"challenge", phrase:"handover", alternatives:["morning","ready"]},
  {id:"challenge-dinner", t:"challenge", phrase:"dinner", alternatives:["breakfast","price"], recall:true},
  {id:"challenge-water", t:"challenge", phrase:"water", alternatives:["van","booking"]}
];
