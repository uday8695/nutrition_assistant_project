import React from 'react';
import './DietPlanList.css';

const DietPlanList = ({ plans }) => {
  if (!plans || plans.length === 0) {
    return <p className="no-plans">No diet plans found.</p>;
  }

  return (
    <ul className="diet-plan-list">
      {plans.map((plan, idx) => (
        <li key={plan._id || idx} className="diet-plan-item">
          <span className="plan-date">{plan.date ? new Date(plan.date).toLocaleDateString() : 'N/A'}</span>
          <span className="plan-suggestion">{plan.suggestion}</span>
          {plan.foods && plan.foods.length > 0 && (
            <ul className="plan-foods">
              {plan.foods.map((food, i) => (
                <li key={i}>{food.name} - {food.grams}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default DietPlanList;