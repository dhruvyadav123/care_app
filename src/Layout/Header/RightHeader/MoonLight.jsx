import React, { useContext, useEffect, useState } from 'react';
import SvgIcon from '../../../Components/Common/Component/SvgIcon';
import CustomizerContext from '../../../_helper/Customizer';

const MoonLight = () => {
  const { addMixBackgroundLayout, mix_background_layout } = useContext(CustomizerContext);
  const [moonlight, setMoonlight] = useState(mix_background_layout !== 'dark-only');

  useEffect(() => {
    setMoonlight(mix_background_layout !== 'dark-only');
  }, [mix_background_layout]);

  const MoonlightToggle = (light) => {
    if (light) {
      addMixBackgroundLayout('light-only');
      setMoonlight(!light);
    } else {
      addMixBackgroundLayout('dark-only');
      setMoonlight(!light);
    }
  };

  return (
    <li>
      <div className={`header-tool-btn ${moonlight ? '' : 'active'}`} onClick={() => MoonlightToggle(moonlight)}>
        <SvgIcon iconId={'moon'} />
      </div>
    </li>
  );
};

export default MoonLight;
