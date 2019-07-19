"use strict";

var cacheList = {
    name: "images",
    files: [
        "./img/star_empty.svg",
        "./img/star_fill.svg",
        // ICON
        "./img/ico/favicon.ico",
        "./img/ico/android-icon-144x144.png",
        "./img/ico/android-icon-192x192.png",
        "./img/ico/android-icon-36x36.png",
        "./img/ico/android-icon-48x48.png",
        "./img/ico/android-icon-72x72.png",
        "./img/ico/android-icon-96x96.png",
        "./img/ico/apple-icon.png",
        "./img/ico/apple-icon-114x114.png",
        "./img/ico/apple-icon-120x120.png",
        "./img/ico/apple-icon-144x144.png",
        "./img/ico/apple-icon-152x152.png",
        "./img/ico/apple-icon-180x180.png",
        "./img/ico/apple-icon-57x57.png",
        "./img/ico/apple-icon-60x60.png",
        "./img/ico/apple-icon-72x72.png",
        "./img/ico/apple-icon-76x76.png",
        "./img/ico/apple-icon-precomposed.png",
        "./img/ico/favicon-16x16.png",
        "./img/ico/favicon-32x32.png",
        "./img/ico/favicon-96x96.png",
        "./img/ico/ms-icon-144x144.png",
        "./img/ico/ms-icon-150x150.png",
        "./img/ico/ms-icon-310x310.png",
        "./img/ico/ms-icon-70x70.png",
        "./img/ico/icon-512x512.png",
        // STATION IMAGE
        "./img/stations/0001.webp",
        "./img/stations/0002.webp",
        "./img/stations/0003.webp",
        "./img/stations/0004.webp",
        "./img/stations/0005.webp",
        "./img/stations/0006.webp",
        "./img/stations/0007.webp",
        "./img/stations/0008.webp",
        "./img/stations/0009.webp",
        "./img/stations/0010.webp",
        "./img/stations/0011.webp",
        "./img/stations/0012.webp",
        "./img/stations/0013.webp",
        "./img/stations/0014.webp",
        "./img/stations/0015.webp",
        "./img/stations/0016.webp",
        "./img/stations/0017.webp",
        "./img/stations/0018.webp",
        "./img/stations/0019.webp",
        "./img/stations/0020.webp",
        "./img/stations/0021.webp",
        "./img/stations/0022.webp",
        "./img/stations/0023.webp",
        "./img/stations/0024.webp",
        "./img/stations/0025.webp",
        "./img/stations/0026.webp",
        "./img/stations/0027.webp",
        "./img/stations/0028.webp",
        "./img/stations/0029.webp",
        "./img/stations/0030.webp",
        "./img/stations/0031.webp",
        "./img/stations/0032.webp",
        "./img/stations/0033.webp",
        "./img/stations/0034.webp",
        "./img/stations/0035.webp",
        "./img/stations/0036.webp",
        "./img/stations/0037.webp",
        "./img/stations/0038.webp",
        "./img/stations/0039.webp",
        "./img/stations/0040.webp",
        "./img/stations/0041.webp",
        "./img/stations/0042.webp",
        "./img/stations/0043.webp",
        "./img/stations/0044.webp",
        "./img/stations/0045.webp",
        "./img/stations/0046.webp",
        "./img/stations/0047.webp",
        "./img/stations/0048.webp",
        "./img/stations/0049.webp",
        "./img/stations/0050.webp",
        "./img/stations/0051.webp",
        "./img/stations/0052.webp",
        "./img/stations/0053.webp",
        "./img/stations/0054.webp",
        "./img/stations/0055.webp",
        "./img/stations/0056.webp",
        "./img/stations/0057.webp",
        "./img/stations/0058.webp",
        "./img/stations/0059.webp",
        "./img/stations/0060.webp",
        "./img/stations/0061.webp",
        "./img/stations/0062.webp",
        "./img/stations/0063.webp",
        "./img/stations/0064.webp",
        "./img/stations/0065.webp",
        "./img/stations/0066.webp",
        "./img/stations/0067.webp",
        "./img/stations/0068.webp",
        "./img/stations/0069.webp",
        "./img/stations/0070.webp",
        "./img/stations/0071.webp",
        "./img/stations/0072.webp",
        "./img/stations/0073.webp",
        "./img/stations/0074.webp",
        "./img/stations/0075.webp",
        "./img/stations/0076.webp",
        "./img/stations/0077.webp",
        "./img/stations/0078.webp",
        "./img/stations/0079.webp",
        "./img/stations/0080.webp",
        "./img/stations/0081.webp",
        "./img/stations/0082.webp",
        "./img/stations/0083.webp",
        "./img/stations/0084.webp",
        "./img/stations/0085.webp",
        "./img/stations/0086.webp",
        "./img/stations/0087.webp",
        "./img/stations/0088.webp",
        "./img/stations/0089.webp",
        "./img/stations/0090.webp",
        "./img/stations/0091.webp",
        "./img/stations/0092.webp",
        "./img/stations/0093.webp",
        "./img/stations/0094.webp",
        "./img/stations/0095.webp",
        "./img/stations/0096.webp",
        "./img/stations/0097.webp",
        "./img/stations/0098.webp",
        "./img/stations/0099.webp",
        "./img/stations/0100.webp",
        "./img/stations/0101.webp",
        "./img/stations/0102.webp",
        "./img/stations/0103.webp",
        "./img/stations/0104.webp",
        "./img/stations/0105.webp",
        "./img/stations/0106.webp",
        "./img/stations/0107.webp",
        "./img/stations/0108.webp",
        "./img/stations/0109.webp",
        "./img/stations/0110.webp",
        "./img/stations/0111.webp",
        "./img/stations/0112.webp",
        "./img/stations/0113.webp",
        "./img/stations/0114.webp",
        "./img/stations/0115.webp",
        "./img/stations/0116.webp",
        "./img/stations/0117.webp",
        "./img/stations/0118.webp",
        "./img/stations/0119.webp",
        "./img/stations/0120.webp",
        "./img/stations/0121.webp",
        "./img/stations/0122.webp",
        "./img/stations/0123.webp",
        "./img/stations/0124.webp",
        "./img/stations/0125.webp",
        "./img/stations/0126.webp",
        "./img/stations/0127.webp",
        "./img/stations/0128.webp",
        "./img/stations/0129.webp",
        "./img/stations/0130.webp",
        "./img/stations/0131.webp",
        "./img/stations/0132.webp",
        "./img/stations/0133.webp",
        "./img/stations/0134.webp",
        "./img/stations/0135.webp",
        "./img/stations/0136.webp",
        "./img/stations/0137.webp",
        "./img/stations/0138.webp",
        "./img/stations/0139.webp",
        "./img/stations/0140.webp",
        "./img/stations/0141.webp",
        "./img/stations/0142.webp",
        "./img/stations/0143.webp",
        "./img/stations/0144.webp",
        "./img/stations/0145.webp",
        "./img/stations/0146.webp",
        "./img/stations/0147.webp",
        "./img/stations/0148.webp",
        "./img/stations/0149.webp",
        "./img/stations/0150.webp",
        "./img/stations/0151.webp",
        "./img/stations/0152.webp",
        "./img/stations/0153.webp",
        "./img/stations/0154.webp",
        "./img/stations/0155.webp",
        "./img/stations/0156.webp",
        "./img/stations/0157.webp",
        "./img/stations/0158.webp",
        "./img/stations/0159.webp",
        "./img/stations/0160.webp",
        "./img/stations/0161.webp",
        "./img/stations/0162.webp",
        "./img/stations/0163.webp",
        "./img/stations/0164.webp",
        "./img/stations/0165.webp",
        "./img/stations/0166.webp",
        "./img/stations/0167.webp",
        "./img/stations/0168.webp",
        "./img/stations/0169.webp",
        "./img/stations/0170.webp",
        "./img/stations/0171.webp",
        "./img/stations/0172.webp",
        "./img/stations/0173.webp",
        "./img/stations/0174.webp",
        "./img/stations/0175.webp",
        "./img/stations/0176.webp",
        "./img/stations/0177.webp",
        "./img/stations/0178.webp",
        "./img/stations/0179.webp",
        "./img/stations/0180.webp",
        "./img/stations/0181.webp",
        "./img/stations/0182.webp",
        "./img/stations/0183.webp",
        "./img/stations/0184.webp",
        "./img/stations/0185.webp",
        "./img/stations/0186.webp",
        "./img/stations/0187.webp",
        "./img/stations/0188.webp",
        "./img/stations/0189.webp",
        "./img/stations/0190.webp",
        "./img/stations/0191.webp",
        "./img/stations/0192.webp",
        "./img/stations/0193.webp",
        "./img/stations/0194.webp",
        "./img/stations/0195.webp",
        "./img/stations/0196.webp",
        "./img/stations/0197.webp",
        "./img/stations/0198.webp",
        "./img/stations/0199.webp",
        "./img/stations/0200.webp",
        "./img/stations/0201.webp",
        "./img/stations/0202.webp",
        "./img/stations/0203.webp",
        "./img/stations/0204.webp",
        "./img/stations/0205.webp",
        "./img/stations/0206.webp",
        "./img/stations/0207.webp",
        "./img/stations/0208.webp",
        "./img/stations/0209.webp",
        "./img/stations/0210.webp",
        "./img/stations/0211.webp",
        "./img/stations/0212.webp",
        "./img/stations/0213.webp",
        "./img/stations/0214.webp",
        "./img/stations/0215.webp",
        "./img/stations/0216.webp",
        "./img/stations/0217.webp",
        "./img/stations/0218.webp",
        "./img/stations/0219.webp",
        "./img/stations/0220.webp",
        "./img/stations/0221.webp",
        "./img/stations/0222.webp",
        "./img/stations/0223.webp",
        "./img/stations/0224.webp",
        "./img/stations/0225.webp",
        "./img/stations/0226.webp",
        "./img/stations/0227.webp",
        "./img/stations/0228.webp",
        "./img/stations/0229.webp",
        "./img/stations/0230.webp",
        "./img/stations/0231.webp",
        "./img/stations/0232.webp",
        "./img/stations/0233.webp",
        "./img/stations/0234.webp",
        "./img/stations/0235.webp",
        "./img/stations/0236.webp",
        "./img/stations/0237.webp",
        "./img/stations/0238.webp",
        "./img/stations/0239.webp",
        "./img/stations/0240.webp",
        "./img/stations/0241.webp",
        "./img/stations/0242.webp",
        "./img/stations/0243.webp",
        "./img/stations/0244.webp",
        "./img/stations/0245.webp",
        "./img/stations/0246.webp",
        "./img/stations/0247.webp",
        "./img/stations/0248.webp",
        "./img/stations/0249.webp",
        "./img/stations/0250.webp",
        "./img/stations/0251.webp",
        "./img/stations/0252.webp",
        "./img/stations/0253.webp",
        "./img/stations/0254.webp",
        "./img/stations/0255.webp",
        "./img/stations/0256.webp",
        "./img/stations/0257.webp",
        "./img/stations/0258.webp",
        "./img/stations/0259.webp",
        "./img/stations/0260.webp",
        "./img/stations/0261.webp",
        "./img/stations/0262.webp",
        "./img/stations/0263.webp",
        "./img/stations/0264.webp",
        "./img/stations/0265.webp",
        "./img/stations/0266.webp",
        "./img/stations/0267.webp",
        "./img/stations/0268.webp",
        "./img/stations/0269.webp",
        "./img/stations/0270.webp",
        "./img/stations/0271.webp",
        "./img/stations/0272.webp",
        "./img/stations/0273.webp",
        "./img/stations/0274.webp",
        "./img/stations/0275.webp",
        "./img/stations/0276.webp",
        "./img/stations/0277.webp",
        "./img/stations/0278.webp",
        "./img/stations/0279.webp",
        "./img/stations/0280.webp",
        "./img/stations/0281.webp",
        "./img/stations/0282.webp",
        "./img/stations/0283.webp",
        "./img/stations/0284.webp",
        "./img/stations/0285.webp",
        "./img/stations/0286.webp",
        "./img/stations/0287.webp",
        "./img/stations/0288.webp",
        "./img/stations/0289.webp",
        "./img/stations/0290.webp",
        "./img/stations/0291.webp",
        "./img/stations/0292.webp",
        "./img/stations/0293.webp",
        "./img/stations/0294.webp",
        "./img/stations/0295.webp",
        "./img/stations/0296.webp",
        "./img/stations/0297.webp",
        "./img/stations/0298.webp",
        "./img/stations/0299.webp",
        "./img/stations/0300.webp",
        "./img/stations/0301.webp",
        "./img/stations/0302.webp",
        "./img/stations/0303.webp",
        "./img/stations/0304.webp",
        "./img/stations/0305.webp",
        "./img/stations/0306.webp",
        "./img/stations/0307.webp",
        "./img/stations/0308.webp",
        "./img/stations/0309.webp",
        "./img/stations/0310.webp",
        "./img/stations/0311.webp",
        "./img/stations/0312.webp",
        "./img/stations/0313.webp",
        "./img/stations/0314.webp",
        "./img/stations/0315.webp",
        "./img/stations/0316.webp",
        "./img/stations/0317.webp",
        "./img/stations/0318.webp",
        "./img/stations/0319.webp",
        "./img/stations/0320.webp",
        "./img/stations/0321.webp",
        "./img/stations/0322.webp",
        "./img/stations/0323.webp",
        "./img/stations/0324.webp",
        "./img/stations/0325.webp",
        "./img/stations/0326.webp",
        "./img/stations/0327.webp",
        "./img/stations/0328.webp",
        "./img/stations/0329.webp",
        "./img/stations/0330.webp",
        "./img/stations/0331.webp",
        "./img/stations/0332.webp",
        "./img/stations/0333.webp",
        "./img/stations/0334.webp",
        "./img/stations/0335.webp",
        "./img/stations/0336.webp",
        "./img/stations/0337.webp",
        "./img/stations/0338.webp",
        "./img/stations/0339.webp",
        "./img/stations/0340.webp",
        "./img/stations/0341.webp",
        "./img/stations/0342.webp",
        "./img/stations/0343.webp",
        "./img/stations/0344.webp",
        "./img/stations/0345.webp",
        "./img/stations/0346.webp",
        "./img/stations/0347.webp",
        "./img/stations/0348.webp",
        "./img/stations/0349.webp",
        "./img/stations/0350.webp",
        "./img/stations/0351.webp",
        "./img/stations/0352.webp",
        "./img/stations/0353.webp",
        "./img/stations/0354.webp",
        "./img/stations/0355.webp",
        "./img/stations/0356.webp",
        "./img/stations/0357.webp",
        "./img/stations/0358.webp",
        "./img/stations/0359.webp",
        "./img/stations/0360.webp",
        "./img/stations/0361.webp",
        "./img/stations/0362.webp",
        "./img/stations/0363.webp",
        "./img/stations/0364.webp",
        "./img/stations/0365.webp",
        "./img/stations/0366.webp",
        "./img/stations/0367.webp",
        "./img/stations/0368.webp",
        "./img/stations/0369.webp",
        "./img/stations/0370.webp",
        "./img/stations/0371.webp",
        "./img/stations/0372.webp",
        "./img/stations/0373.webp",
        "./img/stations/0374.webp",
        "./img/stations/0375.webp",
        "./img/stations/0376.webp",
        "./img/stations/0377.webp",
        "./img/stations/0378.webp",
        "./img/stations/0379.webp",
        "./img/stations/0380.webp",
        "./img/stations/0381.webp",
        "./img/stations/0382.webp",
        "./img/stations/0383.webp",
        "./img/stations/0384.webp",
        "./img/stations/0385.webp",
        "./img/stations/0386.webp",
        "./img/stations/0387.webp",
        "./img/stations/0388.webp",
        "./img/stations/0389.webp",
        "./img/stations/0390.webp",
        "./img/stations/0391.webp",
        "./img/stations/0392.webp",
        "./img/stations/0393.webp",
        "./img/stations/0394.webp",
        "./img/stations/0395.webp",
        "./img/stations/0396.webp",
        "./img/stations/0397.webp",
        "./img/stations/0398.webp",
        "./img/stations/0399.webp",
        "./img/stations/0400.webp",
        "./img/stations/0401.webp",
        "./img/stations/0402.webp",
        "./img/stations/0403.webp",
        "./img/stations/0404.webp",
        "./img/stations/0405.webp",
        "./img/stations/0406.webp",
        "./img/stations/0407.webp",
        "./img/stations/0408.webp",
        "./img/stations/0409.webp",
        "./img/stations/0410.webp",
        "./img/stations/0411.webp",
        "./img/stations/0412.webp",
        "./img/stations/0413.webp",
        "./img/stations/0414.webp",
        "./img/stations/0415.webp",
        "./img/stations/0416.webp",
        "./img/stations/0417.webp",
        "./img/stations/0418.webp",
        "./img/stations/0419.webp",
        "./img/stations/0420.webp",
        "./img/stations/0421.webp",
        "./img/stations/0422.webp",
        "./img/stations/0423.webp",
        "./img/stations/0424.webp",
        "./img/stations/0425.webp",
        "./img/stations/0426.webp",
        "./img/stations/0427.webp",
        "./img/stations/0428.webp",
        "./img/stations/0429.webp",
        "./img/stations/0430.webp",
        "./img/stations/0431.webp",
        "./img/stations/0432.webp",
        "./img/stations/0433.webp",
        "./img/stations/0434.webp",
        "./img/stations/0435.webp",
        "./img/stations/0436.webp",
        "./img/stations/0437.webp",
        "./img/stations/0438.webp",
        "./img/stations/0439.webp",
        "./img/stations/0440.webp",
        "./img/stations/0441.webp",
        "./img/stations/0442.webp",
        "./img/stations/0443.webp",
        "./img/stations/0444.webp",
        "./img/stations/0445.webp",
        "./img/stations/0446.webp",
        "./img/stations/0447.webp",
        "./img/stations/0448.webp",
        "./img/stations/0449.webp",
        "./img/stations/0450.webp",
        "./img/stations/0451.webp",
        "./img/stations/0452.webp",
        "./img/stations/0453.webp",
        "./img/stations/0454.webp",
        "./img/stations/0455.webp",
        "./img/stations/0456.webp",
        "./img/stations/0457.webp",
        "./img/stations/0458.webp",
        "./img/stations/0459.webp",
        "./img/stations/0460.webp",
        "./img/stations/0461.webp",
        "./img/stations/0462.webp",
        "./img/stations/0463.webp",
        "./img/stations/0464.webp",
        "./img/stations/0465.webp",
        "./img/stations/0466.webp",
        "./img/stations/0467.webp",
        "./img/stations/0468.webp",
        "./img/stations/0469.webp",
        "./img/stations/0470.webp",
        "./img/stations/0471.webp",
        "./img/stations/0472.webp",
        "./img/stations/0473.webp",
        "./img/stations/0474.webp",
        "./img/stations/0475.webp",
        "./img/stations/0476.webp",
        "./img/stations/0477.webp",
        "./img/stations/0478.webp",
        "./img/stations/0479.webp",
        "./img/stations/0480.webp",
        "./img/stations/0481.webp",
        "./img/stations/0482.webp",
        "./img/stations/0483.webp",
        "./img/stations/0484.webp",
        "./img/stations/0485.webp",
        "./img/stations/0486.webp",
        "./img/stations/0487.webp",
        "./img/stations/0488.webp",
        "./img/stations/0489.webp",
        "./img/stations/0490.webp",
        "./img/stations/0491.webp",
        "./img/stations/0492.webp",
        "./img/stations/0493.webp",
        "./img/stations/0494.webp",
        "./img/stations/0495.webp",
        "./img/stations/0496.webp",
        "./img/stations/0497.webp",
        "./img/stations/0498.webp",
        "./img/stations/0499.webp",
        "./img/stations/0500.webp",
        "./img/stations/0501.webp",
        "./img/stations/0502.webp",
        "./img/stations/0503.webp",
        "./img/stations/0504.webp",
        "./img/stations/0505.webp",
        "./img/stations/0506.webp",
        "./img/stations/0507.webp",
        "./img/stations/0508.webp",
        "./img/stations/0509.webp",
        "./img/stations/0510.webp",
        "./img/stations/0511.webp",
        "./img/stations/0512.webp",
        "./img/stations/0513.webp",
        "./img/stations/0514.webp",
        "./img/stations/0515.webp",
        "./img/stations/0516.webp",
        "./img/stations/0517.webp",
        "./img/stations/0518.webp",
        "./img/stations/0519.webp",
        "./img/stations/0520.webp",
        "./img/stations/0521.webp",
        "./img/stations/0522.webp",
        "./img/stations/0523.webp",
        "./img/stations/0524.webp",
        "./img/stations/0525.webp",
        "./img/stations/0526.webp",
        "./img/stations/0527.webp",
        "./img/stations/0528.webp",
        "./img/stations/0529.webp",
        "./img/stations/0530.webp",
        "./img/stations/0531.webp",
        "./img/stations/0532.webp",
        "./img/stations/0533.webp",
        "./img/stations/0534.webp",
        "./img/stations/0535.webp",
        "./img/stations/0536.webp",
        "./img/stations/0537.webp",
        "./img/stations/0538.webp",
        "./img/stations/0539.webp",
        "./img/stations/0540.webp",
        "./img/stations/0541.webp",
        "./img/stations/0542.webp",
        "./img/stations/0543.webp",
        "./img/stations/0544.webp",
        "./img/stations/0545.webp",
        "./img/stations/0546.webp",
        "./img/stations/0547.webp",
        "./img/stations/0548.webp",
        "./img/stations/0549.webp",
        "./img/stations/0550.webp",
        "./img/stations/0551.webp",
        "./img/stations/0552.webp",
        "./img/stations/0553.webp",
        "./img/stations/0554.webp",
        "./img/stations/0555.webp",
        "./img/stations/0556.webp",
        "./img/stations/0557.webp",
        "./img/stations/0558.webp",
        "./img/stations/0559.webp",
        "./img/stations/0560.webp",
        "./img/stations/0561.webp",
        "./img/stations/0562.webp",
        "./img/stations/0563.webp",
        "./img/stations/0564.webp",
        "./img/stations/0565.webp",
        "./img/stations/0566.webp",
        "./img/stations/0567.webp",
        "./img/stations/0568.webp",
        "./img/stations/0569.webp",
        "./img/stations/0570.webp",
        "./img/stations/0571.webp",
        "./img/stations/0572.webp",
        "./img/stations/0573.webp",
        "./img/stations/0574.webp",
        "./img/stations/0575.webp",
        "./img/stations/0576.webp",
        "./img/stations/0577.webp",
        "./img/stations/0578.webp",
        "./img/stations/0579.webp",
        "./img/stations/0580.webp",
        "./img/stations/0581.webp",
        "./img/stations/0582.webp",
        "./img/stations/0583.webp",
        "./img/stations/0584.webp",
        "./img/stations/0585.webp",
        "./img/stations/0586.webp",
        "./img/stations/0587.webp",
        "./img/stations/0588.webp",
        "./img/stations/0589.webp",
        "./img/stations/0590.webp",
        "./img/stations/0591.webp",
        "./img/stations/0592.webp",
        "./img/stations/0593.webp",
        "./img/stations/0594.webp",
        "./img/stations/0595.webp",
        "./img/stations/0596.webp",
        "./img/stations/0597.webp",
        "./img/stations/0598.webp",
        "./img/stations/0599.webp",
        "./img/stations/0600.webp",
        "./img/stations/0601.webp",
        "./img/stations/0602.webp",
        "./img/stations/0603.webp",
        "./img/stations/0604.webp",
        "./img/stations/0605.webp",
        "./img/stations/0606.webp",
        "./img/stations/0607.webp",
        "./img/stations/0608.webp",
        "./img/stations/0609.webp",
        "./img/stations/0610.webp",
        "./img/stations/0611.webp",
        "./img/stations/0612.webp",
        "./img/stations/0613.webp",
        "./img/stations/0614.webp",
        "./img/stations/0615.webp",
        "./img/stations/0616.webp",
        "./img/stations/0617.webp",
        "./img/stations/0618.webp",
        "./img/stations/0619.webp",
        "./img/stations/0620.webp",
        "./img/stations/0621.webp",
        "./img/stations/0622.webp",
        "./img/stations/0623.webp",
        "./img/stations/0624.webp",
        "./img/stations/0625.webp",
        "./img/stations/0626.webp",
        "./img/stations/0627.webp",
        "./img/stations/0628.webp",
        "./img/stations/0629.webp",
        "./img/stations/0630.webp",
        "./img/stations/0631.webp",
        "./img/stations/0632.webp",
        "./img/stations/0633.webp",
        "./img/stations/0634.webp",
        "./img/stations/0635.webp",
        "./img/stations/0636.webp",
        "./img/stations/0637.webp",
        "./img/stations/0638.webp",
        "./img/stations/0639.webp",
        "./img/stations/0640.webp",
        "./img/stations/0641.webp",
        "./img/stations/0642.webp",
        "./img/stations/0643.webp",
        "./img/stations/0644.webp",
        "./img/stations/0645.webp",
        "./img/stations/0646.webp",
        "./img/stations/0647.webp",
        "./img/stations/0648.webp",
        "./img/stations/0649.webp",
        "./img/stations/0650.webp",
        "./img/stations/0651.webp",
        "./img/stations/0652.webp",
        "./img/stations/0653.webp",
        "./img/stations/0654.webp",
        "./img/stations/0655.webp",
        "./img/stations/0656.webp",
        "./img/stations/0657.webp",
        "./img/stations/0658.webp",
        "./img/stations/0659.webp",
        "./img/stations/0660.webp",
        "./img/stations/0661.webp",
        "./img/stations/0662.webp",
        "./img/stations/0663.webp",
        "./img/stations/0664.webp",
        "./img/stations/0665.webp",
        "./img/stations/0666.webp",
        "./img/stations/0667.webp",
        "./img/stations/0668.webp",
        "./img/stations/0669.webp",
        "./img/stations/0670.webp",
        "./img/stations/0671.webp",
        "./img/stations/0672.webp",
        "./img/stations/0673.webp",
        "./img/stations/0674.webp",
        "./img/stations/0675.webp",
        "./img/stations/0676.webp",
        "./img/stations/0677.webp",
        "./img/stations/0678.webp",
        "./img/stations/0679.webp",
        "./img/stations/0680.webp",
        "./img/stations/0681.webp",
        "./img/stations/0682.webp",
        "./img/stations/0683.webp",
        "./img/stations/0684.webp",
        "./img/stations/0685.webp",
        "./img/stations/0686.webp",
        "./img/stations/0687.webp",
        "./img/stations/0688.webp",
        "./img/stations/0689.webp",
        "./img/stations/0690.webp",
        "./img/stations/0691.webp",
        "./img/stations/0692.webp",
        "./img/stations/0693.webp",
        "./img/stations/0694.webp",
        "./img/stations/0695.webp",
        "./img/stations/0696.webp",
        "./img/stations/0697.webp",
        "./img/stations/0698.webp",
        "./img/stations/0699.webp",
        "./img/stations/0700.webp",
        "./img/stations/0701.webp"
    ]
};
