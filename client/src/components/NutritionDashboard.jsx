import React, { useState } from 'react';

const nutritionArticles = [
  {
    "id": 1,
    "week": 1,
    "title": "Week 1: Folate for Neural Tube",
    "summary": "Folate-rich foods like kunde and avocado support early fetal development.",
    "fullText": "In week 1, the focus is on folate for neural tube to support both mother and baby through specific nutritional needs. Folate-rich foods like kunde and avocado support early fetal development. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/81/31/88/8131888820217e3139b25cabe77f619a.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "January 05, 2025"
  },
  {
    "id": 2,
    "week": 2,
    "title": "Week 2: Hydration with Uji",
    "summary": "Hydration with light porridge and soups helps implantation and digestion.",
    "fullText": "In week 2, the focus is on hydration with uji to support both mother and baby through specific nutritional needs. Hydration with light porridge and soups helps implantation and digestion. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/f0/ad/0c/f0ad0c49b86274a2a9f85ceb3354e59f.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "January 12, 2025"
  },
  {
    "id": 3,
    "week": 3,
    "title": "Week 3: Iron Boost",
    "summary": "Add leafy greens and liver to help build blood and prevent early anemia.",
    "fullText": "In week 3, the focus is on iron boost to support both mother and baby through specific nutritional needs. Add leafy greens and liver to help build blood and prevent early anemia. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/54/5c/51/545c519e54810e302caa9c614aa9ddf6.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "January 19, 2025"
  },
  {
    "id": 4,
    "week": 4,
    "title": "Week 4: Bone Formation with Calcium",
    "summary": "Week 4 needs calcium\u2014omena and milk support early skeletal growth.",
    "fullText": "In week 4, the focus is on bone formation with calcium to support both mother and baby through specific nutritional needs. Week 4 needs calcium\u2014omena and milk support early skeletal growth. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/4b/8d/9d/4b8d9d169274cf3cb90ade6e31b802a9.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "January 26, 2025"
  },
  {
    "id": 5,
    "week": 5,
    "title": "Week 5: Soothe Morning Sickness",
    "summary": "Try bland foods like arrowroots and ginger tea to ease nausea.",
    "fullText": "In week 5, the focus is on soothe morning sickness to support both mother and baby through specific nutritional needs. Try bland foods like arrowroots and ginger tea to ease nausea. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/53/a9/69/53a969d32288138a9fcbaa5058a2948b.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "February 02, 2025"
  },
  {
    "id": 6,
    "week": 6,
    "title": "Week 6: Energy Foods",
    "summary": "Root vegetables and grains provide sustained energy for growing demands.",
    "fullText": "In week 6, the focus is on energy foods to support both mother and baby through specific nutritional needs. Root vegetables and grains provide sustained energy for growing demands. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/30/bb/93/30bb93d89f5eeee3f199c0ffe9191467.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "February 09, 2025"
  },
  {
    "id": 7,
    "week": 7,
    "title": "Week 7: Digestive Support",
    "summary": "Fermented foods like mursik and uji support gut health.",
    "fullText": "In week 7, the focus is on digestive support to support both mother and baby through specific nutritional needs. Fermented foods like mursik and uji support gut health. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/db/09/ed/db09edf4115f6870bf4327a55bd06739.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "February 16, 2025"
  },
  {
    "id": 8,
    "week": 8,
    "title": "Week 8: Protein Power",
    "summary": "Legumes, eggs, and lentils aid muscle and organ development.",
    "fullText": "In week 8, the focus is on protein power to support both mother and baby through specific nutritional needs. Legumes, eggs, and lentils aid muscle and organ development. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/6e/2b/13/6e2b1340b3d520bcfcf204a57ca85aef.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "February 23, 2025"
  },
  {
    "id": 9,
    "week": 9,
    "title": "Week 9: Vitamin C and Iron Absorption",
    "summary": "Boost citrus fruits to aid iron absorption.",
    "fullText": "In week 9, the focus is on vitamin c and iron absorption to support both mother and baby through specific nutritional needs. Boost citrus fruits to aid iron absorption. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/99/b0/3c/99b03cc0810b16e19aaaf00631c13dba.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "March 02, 2025"
  },
  {
    "id": 10,
    "week": 10,
    "title": "Week 10: Weight Gain the Healthy Way",
    "summary": "Add groundnuts and avocado for healthy fat stores.",
    "fullText": "In week 10, the focus is on weight gain the healthy way to support both mother and baby through specific nutritional needs. Add groundnuts and avocado for healthy fat stores. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/81/31/88/8131888820217e3139b25cabe77f619a.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "March 09, 2025"
  },
  {
    "id": 11,
    "week": 11,
    "title": "Week 11: Brain Development with Omega-3",
    "summary": "Incorporate sardines and tilapia for baby's brain.",
    "fullText": "In week 11, the focus is on brain development with omega-3 to support both mother and baby through specific nutritional needs. Incorporate sardines and tilapia for baby's brain. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/f0/ad/0c/f0ad0c49b86274a2a9f85ceb3354e59f.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "March 16, 2025"
  },
  {
    "id": 12,
    "week": 12,
    "title": "Week 12: Prevent Constipation",
    "summary": "Pumpkin, papaya, and fiber-rich foods aid digestion.",
    "fullText": "In week 12, the focus is on prevent constipation to support both mother and baby through specific nutritional needs. Pumpkin, papaya, and fiber-rich foods aid digestion. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/54/5c/51/545c519e54810e302caa9c614aa9ddf6.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "March 23, 2025"
  },
  {
    "id": 13,
    "week": 13,
    "title": "Week 13: Blood Pressure Control",
    "summary": "Eat bananas, spinach, and reduce sodium.",
    "fullText": "In week 13, the focus is on blood pressure control to support both mother and baby through specific nutritional needs. Eat bananas, spinach, and reduce sodium. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/4b/8d/9d/4b8d9d169274cf3cb90ade6e31b802a9.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "March 30, 2025"
  },
  {
    "id": 14,
    "week": 14,
    "title": "Week 14: Appetite Changes",
    "summary": "Balance smaller frequent meals and hydration.",
    "fullText": "In week 14, the focus is on appetite changes to support both mother and baby through specific nutritional needs. Balance smaller frequent meals and hydration. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/53/a9/69/53a969d32288138a9fcbaa5058a2948b.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "April 06, 2025"
  },
  {
    "id": 15,
    "week": 15,
    "title": "Week 15: Cravings & Control",
    "summary": "Healthy snacks like boiled maize and roasted groundnuts help.",
    "fullText": "In week 15, the focus is on cravings & control to support both mother and baby through specific nutritional needs. Healthy snacks like boiled maize and roasted groundnuts help. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/30/bb/93/30bb93d89f5eeee3f199c0ffe9191467.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "April 13, 2025"
  },
  {
    "id": 16,
    "week": 16,
    "title": "Week 16: Building Baby\u2019s Bones",
    "summary": "Dark greens and dairy increase calcium reserves.",
    "fullText": "In week 16, the focus is on building baby\u2019s bones to support both mother and baby through specific nutritional needs. Dark greens and dairy increase calcium reserves. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/db/09/ed/db09edf4115f6870bf4327a55bd06739.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "April 20, 2025"
  },
  {
    "id": 17,
    "week": 17,
    "title": "Week 17: Muscle Development",
    "summary": "Increase protein-rich legumes and grains.",
    "fullText": "In week 17, the focus is on muscle development to support both mother and baby through specific nutritional needs. Increase protein-rich legumes and grains. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/6e/2b/13/6e2b1340b3d520bcfcf204a57ca85aef.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "April 27, 2025"
  },
  {
    "id": 18,
    "week": 18,
    "title": "Week 18: Combat Fatigue",
    "summary": "Iron-rich porridge and fresh fruits help fight fatigue.",
    "fullText": "In week 18, the focus is on combat fatigue to support both mother and baby through specific nutritional needs. Iron-rich porridge and fresh fruits help fight fatigue. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/99/b0/3c/99b03cc0810b16e19aaaf00631c13dba.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "May 04, 2025"
  },
  {
    "id": 19,
    "week": 19,
    "title": "Week 19: Skin & Cell Growth",
    "summary": "Vitamin A-rich foods like pumpkin and mangoes support skin.",
    "fullText": "In week 19, the focus is on skin & cell growth to support both mother and baby through specific nutritional needs. Vitamin A-rich foods like pumpkin and mangoes support skin. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/81/31/88/8131888820217e3139b25cabe77f619a.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "May 11, 2025"
  },
  {
    "id": 20,
    "week": 20,
    "title": "Week 20: Preventing Leg Cramps",
    "summary": "Magnesium from bananas and millet helps muscle health.",
    "fullText": "In week 20, the focus is on preventing leg cramps to support both mother and baby through specific nutritional needs. Magnesium from bananas and millet helps muscle health. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/f0/ad/0c/f0ad0c49b86274a2a9f85ceb3354e59f.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "May 18, 2025"
  },
  {
    "id": 21,
    "week": 21,
    "title": "Week 21: Nervous System Support",
    "summary": "B-vitamins from beans and sweet potatoes are crucial.",
    "fullText": "In week 21, the focus is on nervous system support to support both mother and baby through specific nutritional needs. B-vitamins from beans and sweet potatoes are crucial. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/54/5c/51/545c519e54810e302caa9c614aa9ddf6.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "May 25, 2025"
  },
  {
    "id": 22,
    "week": 22,
    "title": "Week 22: Managing Heartburn",
    "summary": "Warm uji and fewer acidic foods reduce discomfort.",
    "fullText": "In week 22, the focus is on managing heartburn to support both mother and baby through specific nutritional needs. Warm uji and fewer acidic foods reduce discomfort. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/4b/8d/9d/4b8d9d169274cf3cb90ade6e31b802a9.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "June 01, 2025"
  },
  {
    "id": 23,
    "week": 23,
    "title": "Week 23: Lung Development",
    "summary": "Zinc and vitamin E in nuts and seeds support lungs.",
    "fullText": "In week 23, the focus is on lung development to support both mother and baby through specific nutritional needs. Zinc and vitamin E in nuts and seeds support lungs. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/53/a9/69/53a969d32288138a9fcbaa5058a2948b.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "June 08, 2025"
  },
  {
    "id": 24,
    "week": 24,
    "title": "Week 24: Strengthen Immunity",
    "summary": "Citrus, garlic, and honey keep immunity high.",
    "fullText": "In week 24, the focus is on strengthen immunity to support both mother and baby through specific nutritional needs. Citrus, garlic, and honey keep immunity high. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/30/bb/93/30bb93d89f5eeee3f199c0ffe9191467.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "June 15, 2025"
  },
  {
    "id": 25,
    "week": 25,
    "title": "Week 25: Prepare for Final Growth Spurt",
    "summary": "Extra calories from nutritious carbs like cassava.",
    "fullText": "In week 25, the focus is on prepare for final growth spurt to support both mother and baby through specific nutritional needs. Extra calories from nutritious carbs like cassava. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/db/09/ed/db09edf4115f6870bf4327a55bd06739.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "June 22, 2025"
  },
  {
    "id": 26,
    "week": 26,
    "title": "Week 26: Stretch Mark Prevention",
    "summary": "Hydration, avocado, and nuts support skin elasticity.",
    "fullText": "In week 26, the focus is on stretch mark prevention to support both mother and baby through specific nutritional needs. Hydration, avocado, and nuts support skin elasticity. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/6e/2b/13/6e2b1340b3d520bcfcf204a57ca85aef.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "June 29, 2025"
  },
  {
    "id": 27,
    "week": 27,
    "title": "Week 27: Last Trimester Protein",
    "summary": "Add extra eggs and beans to support rapid growth.",
    "fullText": "In week 27, the focus is on last trimester protein to support both mother and baby through specific nutritional needs. Add extra eggs and beans to support rapid growth. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/99/b0/3c/99b03cc0810b16e19aaaf00631c13dba.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "July 06, 2025"
  },
  {
    "id": 28,
    "week": 28,
    "title": "Week 28: Blood Supply Surge",
    "summary": "Watermelon and beetroot boost blood flow.",
    "fullText": "In week 28, the focus is on blood supply surge to support both mother and baby through specific nutritional needs. Watermelon and beetroot boost blood flow. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/81/31/88/8131888820217e3139b25cabe77f619a.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "July 13, 2025"
  },
  {
    "id": 29,
    "week": 29,
    "title": "Week 29: Fat Storage Support",
    "summary": "Include nutrient-dense oils and fruits.",
    "fullText": "In week 29, the focus is on fat storage support to support both mother and baby through specific nutritional needs. Include nutrient-dense oils and fruits. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/f0/ad/0c/f0ad0c49b86274a2a9f85ceb3354e59f.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "July 20, 2025"
  },
  {
    "id": 30,
    "week": 30,
    "title": "Week 30: Vision Development",
    "summary": "Carrots and pumpkin for vitamin A and retina growth.",
    "fullText": "In week 30, the focus is on vision development to support both mother and baby through specific nutritional needs. Carrots and pumpkin for vitamin A and retina growth. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/54/5c/51/545c519e54810e302caa9c614aa9ddf6.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "July 27, 2025"
  },
  {
    "id": 31,
    "week": 31,
    "title": "Week 31: Thickening Skin",
    "summary": "Protein and omega-3 fats support skin layers.",
    "fullText": "In week 31, the focus is on thickening skin to support both mother and baby through specific nutritional needs. Protein and omega-3 fats support skin layers. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/4b/8d/9d/4b8d9d169274cf3cb90ade6e31b802a9.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "August 03, 2025"
  },
  {
    "id": 32,
    "week": 32,
    "title": "Week 32: Brain Folds Forming",
    "summary": "Boost DHA from eggs and fish.",
    "fullText": "In week 32, the focus is on brain folds forming to support both mother and baby through specific nutritional needs. Boost DHA from eggs and fish. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/53/a9/69/53a969d32288138a9fcbaa5058a2948b.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "August 10, 2025"
  },
  {
    "id": 33,
    "week": 33,
    "title": "Week 33: Practice Breathing Begins",
    "summary": "Iron and hydration keep lungs and blood healthy.",
    "fullText": "In week 33, the focus is on practice breathing begins to support both mother and baby through specific nutritional needs. Iron and hydration keep lungs and blood healthy. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/30/bb/93/30bb93d89f5eeee3f199c0ffe9191467.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "August 17, 2025"
  },
  {
    "id": 34,
    "week": 34,
    "title": "Week 34: Antioxidant Protection",
    "summary": "Colorful fruits protect baby from oxidative stress.",
    "fullText": "In week 34, the focus is on antioxidant protection to support both mother and baby through specific nutritional needs. Colorful fruits protect baby from oxidative stress. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/db/09/ed/db09edf4115f6870bf4327a55bd06739.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "August 24, 2025"
  },
  {
    "id": 35,
    "week": 35,
    "title": "Week 35: Strength Before Birth",
    "summary": "High-iron and protein help final growth.",
    "fullText": "In week 35, the focus is on strength before birth to support both mother and baby through specific nutritional needs. High-iron and protein help final growth. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/6e/2b/13/6e2b1340b3d520bcfcf204a57ca85aef.jpg",
    "author": "Dr. Achieng Odongo \u2013 Prenatal Nutritionist",
    "publishedAt": "August 31, 2025"
  },
  {
    "id": 36,
    "week": 36,
    "title": "Week 36: Bowel Prep",
    "summary": "High-fiber foods reduce constipation ahead of labor.",
    "fullText": "In week 36, the focus is on bowel prep to support both mother and baby through specific nutritional needs. High-fiber foods reduce constipation ahead of labor. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/99/b0/3c/99b03cc0810b16e19aaaf00631c13dba.jpg",
    "author": "Mama Akoth \u2013 Mama Africa Resident Nutritionist",
    "publishedAt": "September 07, 2025"
  },
  {
    "id": 37,
    "week": 37,
    "title": "Week 37: Bone Marrow & Red Blood Cells",
    "summary": "Boost folate and iron in final stretch.",
    "fullText": "In week 37, the focus is on bone marrow & red blood cells to support both mother and baby through specific nutritional needs. Boost folate and iron in final stretch. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/81/31/88/8131888820217e3139b25cabe77f619a.jpg",
    "author": "Dr. Wanjiku Ndegwa \u2013 Community Health Nutrition Expert",
    "publishedAt": "September 14, 2025"
  },
  {
    "id": 38,
    "week": 38,
    "title": "Week 38: Fat Layer Finishing",
    "summary": "Healthy fats like coconut and avocado support skin.",
    "fullText": "In week 38, the focus is on fat layer finishing to support both mother and baby through specific nutritional needs. Healthy fats like coconut and avocado support skin. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/f0/ad/0c/f0ad0c49b86274a2a9f85ceb3354e59f.jpg",
    "author": "Mama Halima \u2013 Mama Africa Lactation and Nutrition Lead",
    "publishedAt": "September 21, 2025"
  },
  {
    "id": 39,
    "week": 39,
    "title": "Week 39: Water Retention Tips",
    "summary": "Stay hydrated and reduce salt.",
    "fullText": "In week 39, the focus is on water retention tips to support both mother and baby through specific nutritional needs. Stay hydrated and reduce salt. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/54/5c/51/545c519e54810e302caa9c614aa9ddf6.jpg",
    "author": "Dr. Atieno Mboya \u2013 Senior Nutritionist, Mama Africa",
    "publishedAt": "September 28, 2025"
  },
  {
    "id": 40,
    "week": 40,
    "title": "Week 40: Labor Prep Diet",
    "summary": "Eat lighter meals with energy-boosting fruits.",
    "fullText": "In week 40, the focus is on labor prep diet to support both mother and baby through specific nutritional needs. Eat lighter meals with energy-boosting fruits. Traditional African foods like millet porridge, kunde (cowpeas), sukuma wiki (collard greens), omena (small dried fish), and fermented milk (mursik) are not only nutrient-rich but also culturally familiar and accessible. For example, folate helps prevent neural tube defects and can be found in managu and terere; calcium in omena supports skeletal development; and iron-rich ndengu helps combat fatigue and anemia. Remember, hydration is key throughout pregnancy\u2014drinks like tamarind juice, coconut water, or simply clean boiled water should be part of your daily intake. Listen to your body, and when in doubt, consult your local healthcare provider. Growing life is serious work\u2014but your taste buds can still have a party!",
    "image": "https://i.pinimg.com/736x/4b/8d/9d/4b8d9d169274cf3cb90ade6e31b802a9.jpg",
    "author": "Mama Grace \u2013 Traditional Foods Specialist",
    "publishedAt": "October 05, 2025"
  }
];

const NutritionDashboard = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans bg-cyan-50 rounded-lg">
      <h1 className="text-3xl font-bold text-cyan-800 mb-4">Nutrition Hub for African Mums</h1>
      <p className="mb-6 text-cyan-700 font-medium">Explore culturally-relevant nutrition tips and weekly meal guidance tailored to African mums.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionArticles.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9 w-full">
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-between p-4 flex-grow">
              <div>
                <h2 className="text-lg font-semibold text-cyan-800 mb-1">{item.title}</h2>
                <p className="text-gray-700 mb-3">{item.summary}</p>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => setSelectedArticle(item)}
                  className="text-cyan-700 font-medium hover:underline"
                >
                  Read More →
                </button>
                <div className="text-sm text-gray-500 mt-2">
                  <p className="italic">By {item.author}</p>
                  <p className="text-xs">{item.publishedAt}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setSelectedArticle(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-cyan-800 mb-2">{selectedArticle.title}</h2>
            <p className="text-gray-700 mb-4 italic">By {selectedArticle.author} on {selectedArticle.publishedAt}</p>
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <p className="text-gray-800">{selectedArticle.fullText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionDashboard;
