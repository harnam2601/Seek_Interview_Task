var newPricingRules = [];
var editedSpecial = {};
document.getElementById("pricing-rules-data").value = JSON.stringify(newPricingRules);
var newPricingRuleCount = newPricingRules.length;
const adsList = JSON.parse(document.getElementById("ad-list").value);
var adListHTML = ``;
adsList.forEach(ad => {
  adListHTML =  adListHTML + `<option value="${ad['_id']}">${ad.title} ($${ad.price})</option>`;
});
const specialList = JSON.parse(document.getElementById("special-list").value);
specialSelected('special', specialList[0]['_id'].toString());

function addNewPricingRule(){

  newPricingRules.push({
    type: 'getExtra',
    adId: adsList[0]["_id"],
    minBuy: 0,
    extras: 0,
    discountedPrice: 0 
  });

  document.getElementById("pricing-rules-data").value = JSON.stringify(newPricingRules);

  newPricingRuleCount++;
  const pricingRulesContainer = document.getElementById('pricing-rules-container');

  const ruleNumberHTML = `
  <div class="form-control">
    <label for="">Rule ${newPricingRuleCount}</label>
  </div>
  `;

  const selectAdHTML = `
  <div class="form-control">
    <label for="">Choose Ad</label>
    <select name="pricingRuleAd_${newPricingRuleCount}" id="pricing-rule-ad_${newPricingRuleCount}" onchange="editNewRule(this.id, this.value, ${newPricingRuleCount})">
      ${adListHTML}
    </select>
  </div>
  `;

  const selectPricingRuleTypeHTML = `
  <div class="form-control">
    <label for="">Select Rule Type</label>
    <select name="pricingRuleType_${newPricingRuleCount}" id="pricing-rule-type_${newPricingRuleCount}" onchange="ruleTypeSelected(this.id, this.value, ${newPricingRuleCount}); adjustPanelHeight('add-special-panel'); editNewRule(this.id, this.value, ${newPricingRuleCount})">
      <option value="getExtra">Get Extra</option>
      <option value="discountedPrice">Discounted Price</option>
    </select>
  </div>
  `;

  const ruleSettingsHTML = `
  <div class="form-control" id="rules-setting-container_${newPricingRuleCount}">
    <div class="form-control">
      <label for="">Minimum Buy</label>
      <input type="number" min="1" name="pricingRuleMinBy_${newPricingRuleCount}" id="pricing-rule-min-buy_${newPricingRuleCount}" oninput="editNewRule(this.id, this.value, ${newPricingRuleCount})">
    </div> 
    <div class="form-control">
      <label for="">Extras</label>
      <input type="number" min="1" name="pricingRuleExtras_${newPricingRuleCount}" id="pricing-rule-extras_${newPricingRuleCount}" oninput="editNewRule(this.id, this.value, ${newPricingRuleCount})">
    </div>
  </div>
  `;

  pricingRulesContainer.innerHTML = `
  ${pricingRulesContainer.innerHTML}
  ${ruleNumberHTML}
  ${selectAdHTML}
  ${selectPricingRuleTypeHTML}
  ${ruleSettingsHTML}
  `;
}

function adjustPanelHeight(elemId){
  const panel = document.getElementById(elemId);
  panel.style.maxHeight = panel.scrollHeight + "px";
  panel.style.height = panel.scrollHeight + "px";
}

function ruleTypeSelected(elemId, val, ruleId){
  const container = document.getElementById('rules-setting-container_'+ruleId);
  var rulesSettingsHTML = '';
  if(val == 'getExtra'){
    rulesSettingsHTML = `
    <div class="form-control">
      <label for="">Minimum Buy</label>
      <input type="number" min="1" name="pricingRuleMinBuy_${ruleId}" id="pricing-rule-min-buy_${ruleId}" oninput="editNewRule(this.id, this.value, ${ruleId})">
    </div> 
    <div class="form-control">
      <label for="">Extras</label>
      <input type="number" min="1" name="pricingRuleExtras_${ruleId}" id="pricing-rule-extras_${ruleId}" oninput="editNewRule(this.id, this.value, ${ruleId})">
    </div>
    `;
  }
  else if(val == 'discountedPrice'){
    rulesSettingsHTML = `
    <div class="form-control">
      <label for="">Discounted Price</label>
      <input type="text" name="pricingRuleDiscountedPrice_${ruleId}" id="pricing-rule-discounted-price_${ruleId}" oninput="editNewRule(this.id, this.value, ${ruleId})">
    </div> `;
  }

  container.innerHTML = rulesSettingsHTML;
}

function editNewRule(elemId, value, ruleIndex){

  switch(elemId.split("_")[0]){
    case 'pricing-rule-ad': newPricingRules[ruleIndex - 1].adId = value;
    break;
    case 'pricing-rule-type': newPricingRules[ruleIndex - 1].type = value;
    break;
    case 'pricing-rule-min-buy': newPricingRules[ruleIndex -1].minBuy = parseInt(value);
    break;
    case 'pricing-rule-extras': newPricingRules[ruleIndex - 1].extras = parseInt(value);
    break;
    case 'pricing-rule-discounted-price': newPricingRules[ruleIndex - 1].discountedPrice = parseFloat(value);
    break;
  }
  document.getElementById("pricing-rules-data").value = JSON.stringify(newPricingRules);
}

function renderPricingRuleSettings(elemId, value){
  const pricingRulesContainer = document.getElementById('pricing-rules-container');
  pricingRulesContainer.innerHTML = '';
  newPricingRules = [];
  newPricingRuleCount = 0;
  for(let i = 0; i < parseInt(value); i++){
    addNewPricingRule();
  }
  adjustPanelHeight('add-special-panel');
}

function specialSelected(elemId, value){

  let selectedSpecial = {};
  let selectedSpecialIndex = null;
  specialList.forEach((special, index) => {
    if(special["_id"].toString() == value){
      selectedSpecial = special;
      selectedSpecialIndex = index;
    }
  });

  editedSpecial = selectedSpecial;
  document.getElementById('edited-special-data').value = JSON.stringify(editedSpecial);

  const specialContainer = document.getElementById("special-container");

  const specialTitleHTML = `
  <div class="form-control">
    <label for="title">Title</label>
    <input type="text" name="title" id="title" value="${selectedSpecial.title}" onchange="editSpecial(this.id, this.value)"
  </div>
  `;

  const pricingRulesContainer = `
  <div id="edit-pricing-rule-container">
  </div>
  `;

  specialContainer.innerHTML = `
  ${specialTitleHTML}
  ${pricingRulesContainer}
  `;

  let pricingRulesHTML = '';

  selectedSpecial.pricingRules.forEach((rule, index) => {
    pricingRulesHTML = pricingRulesHTML + `
    <div class="form-control">
      <label for="">Rule ${index + 1}</label>
    </div>
    <div class="form-control">
      <label for="">Edit Ad</label>
      <select name="ruleAd_${selectedSpecialIndex}_${index}" id="pricing-rule-ad_${selectedSpecialIndex}_${index}" onchange="editSpecial(this.id, this.value, ${index})">
        ${adListHTML}
      </select>
    </div>
    <div class="form-control">
      <label for="">Rule Type</label>
      <select name="ruleType_${selectedSpecialIndex}_${index}" id="pricing-rule-type_${selectedSpecialIndex}_${index}" onchange="toggleRuleTypeSettings(this.id, this.value, ${selectedSpecialIndex}, ${index}); editSpecial(this.id, this.value, ${index}); adjustPanelHeight('edit-special-panel')">
        <option value="getExtra" ${rule.type == 'getExtra' ? 'selected' : ''} >Get Extra</option>
        <option value="discountedPrice" ${rule.type == 'discountedPrice' ? 'selected' : ''} >Discounted Price</option>
      </select>
    </div>
    <div class="form-control">
      <label for="">Minimum Buy</label>
      <input type="number" name="ruleMinBuy_${selectedSpecialIndex}_${index}" id="pricing-rule-min-buy_${selectedSpecialIndex}_${index}" value="${rule.minBuy ? rule.minBuy : ''}" onchange="editSpecial(this.id, this.value, ${index})">
    </div>
    <div class="form-control">
      <label for="">Extras</label>
      <input type="number" name="ruleExtra_${selectedSpecialIndex}_${index}" id="pricing-rule-extra_${selectedSpecialIndex}_${index}" value="${rule.extra ? rule.extra : ''}" onchange="editSpecial(this.id, this.value, ${index})">
    </div>
    <div class="form-control">
      <label for="">Discounted Price</label>
      <input type="text" name="ruleDiscountedPrice_${selectedSpecialIndex}_${index}" id="pricing-rule-discounted-price_${selectedSpecialIndex}_${index}" value="${rule.discountedPrice ? rule.discountedPrice : ''}" onchange="editSpecial(this.id, this.value, ${index})">
    </div>
    `;
  });

  document.getElementById('edit-pricing-rule-container').innerHTML = pricingRulesHTML;

  selectedSpecial.pricingRules.forEach((rule, index) => {
    document.getElementById('pricing-rule-ad_'+selectedSpecialIndex+"_"+index).value = rule.adId;
    if(rule.type == 'getExtra'){
      document.getElementById("pricing-rule-discounted-price_"+selectedSpecialIndex+"_"+index).parentElement.style.display = "none";
    }else{
      document.getElementById("pricing-rule-min-buy_"+selectedSpecialIndex+"_"+index).parentElement.style.display = "none";
      document.getElementById("pricing-rule-extra_"+selectedSpecialIndex+"_"+index).parentElement.style.display = "none";
    }
  });
}

function toggleRuleTypeSettings(elemId, value, specialIndex, ruleIndex){
  if(value == 'getExtra'){
    document.getElementById("pricing-rule-min-buy_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'block';
    document.getElementById("pricing-rule-extra_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'block';
    document.getElementById("pricing-rule-discounted-price_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'none';
  }
  else{
    document.getElementById("pricing-rule-min-buy_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'none';
    document.getElementById("pricing-rule-extra_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'none';
    document.getElementById("pricing-rule-discounted-price_"+specialIndex+"_"+ruleIndex).parentElement.style.display = 'block';
  }
}

function editSpecial(elemId, value, ruleIndex){
  if(elemId == 'title'){
    editedSpecial.title = value;
  }
  if(ruleIndex >= 0){
    elemId = elemId.split("_")[0];
    ruleIndex = parseInt(ruleIndex);
    switch(elemId){
      case "pricing-rule-ad": editedSpecial.pricingRules[ruleIndex].adId = value;
      break;
      case "pricing-rule-type": editedSpecial.pricingRules[ruleIndex].type = value;
      break;
      case "pricing-rule-min-buy": editedSpecial.pricingRules[ruleIndex].minBuy = parseInt(value);
      break;
      case "pricing-rule-extra": editedSpecial.pricingRules[ruleIndex].extra = parseInt(value);
      break;
      case "pricing-rule-discounted-price": editedSpecial.pricingRules[ruleIndex].discountedPrice = parseFloat(value);
      break;
    }
  }
  document.getElementById('edited-special-data').value = JSON.stringify(editedSpecial);
}