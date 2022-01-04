<template>
  <div class="app-container" style="width: 100%;height: 100%;float: left">

    <div style="width: 100%; height:100%; margin-left: 1%; margin-top: 0.5%">
      <!-- 覆盖事件 -->
      <div style="width: 98%;height: 98%; position:absolute;z-index:1;">
        <!-- 第一列的五个 进厂车、煤场、配煤单仓、炉煤塔、合成氨装置 -->
        <div style="height: 40%;width:100%; opacity:0.5;float: left">
          <div style="height: 56%;width:19%; margin-top: 5%;margin-left: 2%;float: left" @mouseover="div_2_1_none()"
               @mouseleave="div_2_1_block()"></div>
          <div style="height: 57%;width:16%; margin-top: 7%;margin-left: 5%;float: left" @mouseover="div_1_1_none()"
               @mouseleave="div_1_1_block()"></div>
          <div style="height: 57%;width:13%; margin-top: 5%;margin-left: 4%;float: left" @mouseover="div_1_2_none()"
               @mouseleave="div_1_2_block()"></div>
          <div style="height: 52%;width:8%; margin-top: 11%;margin-left: 1%;float: left" @mouseover="div_2_3_none()"
               @mouseleave="div_2_3_block()"></div>
          <div style="height: 79%;width:14%; margin-top: 4%;margin-left: 2%;float: left" @mouseover="div_1_3_none()"
               @mouseleave="div_1_3_block()"></div>
        </div>

        <!-- 第二列的五个 焦仓、干熄炉、炼焦炉、化产装置、甲醇装置 -->
        <div style="height: 37%;width:100%; opacity:0.5;float: left">
          <div style="height: 88%;width:18%; margin-top: 2%;margin-left: 12%;float: left" @mouseover="div_3_1_none()"
               @mouseleave="div_3_1_block()"></div>
          <div style="height: 60%;width:7%; margin-left: 1%;float: left" @mouseover="div_2_2_none()"
               @mouseleave="div_2_2_block()"></div>
          <div style="height: 75%;width:17%; margin-top: 2%;margin-left: 4%;float: left" @mouseover="div_3_2_none()"
               @mouseleave="div_3_2_block()"></div>
          <div style="height: 85%;width:13%; margin-top: 2%;margin-left: 6%;float: left" @mouseover="div_3_4_none()"
               @mouseleave="div_3_4_block()"></div>
          <div style="height: 83%;width:12%; margin-top: -5%;margin-left: 6.4%;float: left" @mouseover="div_2_4_none()"
               @mouseleave="div_2_4_block()"></div>
        </div>

        <!-- 第三列的一个 出厂车 -->
        <div style="height: 23%;width:100%; opacity:0.5;float: left">
          <div style="height: 90%;width:17%; margin-top: -2%;margin-left: 47%;float: left" @mouseover="div_4_1_none()"
               @mouseleave="div_4_1_block()"></div>
          <div style="height: 45%;width:8%; margin-right: 21%;margin-top:4%;float: right" @mouseover="div_4_2_none()"
               @mouseleave="div_4_2_block()"></div>
        </div>
      </div>

      <!-- 弹框 -->
      <div id="main_div" style="width: 98%;height: 98%; z-index:0; position:absolute;">
        <!-- 第一行弹框 -->
        <div style="height: 25%;width:100%; float: left">
          <!-- 煤场库存 -->
          <div id="div_1_1"
               style="display: none; width: 12%;height: 150%; margin-left: 18%; margin-top: 2%; float: left">
            <!-- 表格数据 -->
            <div style="width: 80%; height: 55%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 100%;height: 30%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  煤场库存
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:21%;margin-left: 8%; height: 24%;width: 65%"/>
                <img src="../assets/images/右边框.png"
                     style="float: right; height: 100%;position: absolute;height: 6%;margin-left: 1.6%"/>
              </div>
              <div
                style="text-align:center; vertical-align:middle; width: 100%;height: 75%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_1_1_table" border="0"
                       style="border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0; border-right: 0">数量</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold;">二期</td>
                    <td style="color: #ffffff; border-right: 0">{{ this.coalHeapData.phaseTwoValue }}</td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold;">四期</td>
                    <td style="color: #ffffff; border-right: 0">{{ this.coalHeapData.phaseFourValue }}</td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold;">合计</td>
                    <td style="color: #ffffff; border-bottom: 0; border-right: 0">
                      {{ getFloat(this.coalHeapData.totalSum, 2) }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- 虚线框 -->
            <div
              style="border-right: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 57%;height: 23%; float: left;margin-top: -30%;margin-left: 88%; ">
              <img src="../assets/images/圆点.png"
                   style="position: absolute; float: left; margin-top: 4.2%;margin-left: 6.45%; opacity:0.85"/>
            </div>
          </div>

          <!-- 配煤单仓-->
          <div id="div_1_2"
               style="display: none; width: 14%;height: 150%;margin-left: 60%; margin-top: 5%; float: left">
            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -3.85%; margin-top: 5.8%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 5%;height: 6%; float: left; position: absolute; margin-left: -3.6%;margin-top: 2.5%"></div>
            <!-- 表格数据 -->
            <div style="width: 90%; height: 55%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 250%;height: 30%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  单仓情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:7%;margin-left: 3%; height: 20%; width: 50%"/>
                <img src="../assets/images/右边框.png"
                     style="float: right; height: 6%; position: absolute;margin-left: 14%"/>
              </div>
              <div
                style="width: 250%;height: 75%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_1_2_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0">二期</th>
                    <th style="border-top: 0; border-right: 0">四期</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold;">上煤量</td>
                    <td style="color: #ffffff">{{ this.singleWarehouseData.phaseTwoCoalUpValue }}</td>
                    <td style="color: #ffffff; border-right: 0">{{ this.singleWarehouseData.phaseFourCoalUpValue }}</td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold;">消耗量</td>
                    <td style="color: #ffffff">{{ this.singleWarehouseData.phaseTwoCoalConsumeValue }}</td>
                    <td style="color: #ffffff; border-right: 0">{{
                        this.singleWarehouseData.phaseFourCoalConsumeValue
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold;">库存量</td>
                    <td style="color: #ffffff; border-bottom: 0">{{
                        this.singleWarehouseData.phaseTwoCoalStockValue
                      }}
                    </td>
                    <td style="color: #ffffff; border-right: 0; border-bottom: 0">
                      {{ this.singleWarehouseData.phaseFourCoalStockValue }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- 合成氨装置-->
          <div id="div_1_3"
               style="display: none; width: 14%;height: 160%;margin-left: 78%;  float: left; margin-top: 2%">
            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -3.85%; margin-top: 5.8%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 5%;height: 6%; float: left; position: absolute; margin-left: -3.6%;margin-top: 2.5%"></div>
            <!-- 数据 -->
            <div style="width: 30%; height: 50%;  float: left;margin-left: 12%">
              <div
                style="width: 100%;height: 75%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.2vw ">
                <div style="color: #9ad3ff; margin-left: 20%; font-size: 0.4vw; margin-top: 5%; font-weight: bold;">
                  {{ this.ammonialIndexData }}
                </div>
                <div>
                  <img src="../assets/images/编组 15.png" width="70%" style="margin-left: 15%;margin-top: 5%">
                </div>
                <div style="color: #9ad3ff; margin-left: 25%; font-size: 0.4vw; margin-top: 5%; font-weight: bold;">氨水
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二行弹框 -->
        <div style="height: 25%;width:100%; float: left">
          <!-- 原料煤入场情况 -->
          <div id="div_2_1" style="display: none; width: 15%;height: 150%; margin-top: -6%">
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 7%; margin-top: 1.85%; opacity:0.85"/>
            <!-- 虚线框 -->
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 29%;height: 50%; float: left;margin-top: 14%;margin-left: 20%; "></div>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-top: 6%; margin-left: -2.5%; opacity:0.85"/>
            <div
              style="border-top: 0.15vw dotted #ffffff; width: 14%;height: 1%; float: left;margin-top: 41%;margin-left: -28%"></div>
            <!-- 表格数据 -->
            <div style="width: 95%; height: 55%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 100%;height: 30%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  原煤入场情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png" style="float: left; margin-top:17%;margin-left: 8%; height: 20%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 75%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_2_1_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">二期</th>
                    <th style="border-top: 0; border-right: 0;">四期</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">火运</td>
                    <td style="color: #ffffff">{{ this.coalInwareHouseData.transPhaseTwoValue }}</td>
                    <td style="color: #ffffff; border-right: 0">{{ this.coalInwareHouseData.transPhaseFourValue }}</td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">汽运</td>
                    <td style="color: #ffffff">{{ this.coalInwareHouseData.carPhaseTwoValue }}</td>
                    <td style="color: #ffffff; border-right: 0">{{ this.coalInwareHouseData.carPhaseFourValue }}</td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">合计</td>
                    <td style="color: #ffffff; border-bottom: 0">
                      {{ getFloat(this.coalInwareHouseData.carAndTransTwoSumValue, 2) }}
                    </td>
                    <td style="color: #ffffff; border-right: 0; border-bottom: 0">
                      {{ getFloat(this.coalInwareHouseData.carAndTransFourSumValue, 2) }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- 干熄炉 -->
          <div id="div_2_2" style="display: none; width: 15%;height: 150%; margin-top: -1%; margin-left: 0%">
            <!-- 表格数据 -->
            <div style="width: 100%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 180%;height: 32%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  焦炭出产情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:8%;margin-left: 4%; height: 20%; width: 80%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 180%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_2_2_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">当日</th>
                    <th style="border-top: 0; border-right: 0;">月累计</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">二期</td>
                    <td style="color: #ffffff">{{ this.cokeProductionIndexData.phaseTwoCokeDayValue }}</td>
                    <td style="color: #ffffff; border-right: 0">
                      {{ this.cokeProductionIndexData.phaseTwoCokeMonthValue }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">三期</td>
                    <td style="color: #ffffff">{{ this.cokeProductionIndexData.phaseThreeCokeDayValue }}</td>
                    <td style="color: #ffffff; border-right: 0">
                      {{ this.cokeProductionIndexData.phaseThreeCokeMonthValue }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">四期</td>
                    <td style="color: #ffffff; border-bottom: 0">
                      {{ this.cokeProductionIndexData.phaseFourCokeDayValue }}
                    </td>
                    <td style="color: #ffffff; border-right: 0; border-bottom: 0">
                      {{ this.cokeProductionIndexData.phaseFourCokeMonthValue }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">五期</td>
                    <td style="color: #ffffff; border-bottom: 0">
                      {{ this.cokeProductionIndexData.phaseFiveCokeDayValue }}
                    </td>
                    <td style="color: #ffffff; border-right: 0; border-bottom: 0">
                      {{ this.cokeProductionIndexData.phaseFiveCokeMonthValue }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 17.5%; margin-top: 11%; opacity:0.85"/>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 40%;height: 25%; float: left;margin-top: -25%;margin-left: 191%; "></div>
          </div>

          <!-- 煤炉塔 -->
          <div id="div_2_3" style="display: none; width: 12.5%;height: 175%; margin-top: -5%; margin-left: 40%">
            <!-- 表格数据 -->
            <div style="width: 100%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 100%;height: 32%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  煤塔库存
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:15%;margin-left: 8%; height: 20%; width: 80%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_2_3_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0; border-right: 0;">数量</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">二期</td>
                    <td style="color: #ffffff; border-right: 0;">{{
                        this.coalTowerIndexData.phaseTwoCoalTowerValue
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">三期</td>
                    <td style="color: #ffffff; border-right: 0;">
                      {{ this.coalTowerIndexData.phaseThreeCoalTowerValue }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">四期</td>
                    <td style="color: #ffffff; border-bottom: 0; border-right: 0;">
                      {{ this.coalTowerIndexData.phaseFourCoalTowerValue }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">五期</td>
                    <td style="color: #ffffff; border-bottom: 0; border-right: 0;">
                      {{ this.coalTowerIndexData.phaseFiveCoalTowerValue }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 6.7%; margin-top: 10%; opacity:0.85"/>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 54.5%;height: 5.5%; float: left;margin-top: -25%;margin-left: 114%; "></div>
          </div>

          <!-- 甲醇装置 -->
          <div id="div_2_4" style="display: none; width: 17%;height: 175%; margin-top: -9%; margin-left: 65%">
            <!-- 表格数据 -->
            <div style="width: 100%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 100%;height: 32%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  驰放气发生量
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; "/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:12%;margin-left: 1%; height: 25%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 2%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_2_4_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0; border-right: 0;">当日</th>
                    <th style="border-top: 0; border-right: 0;">月累计</th>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">甲醇一期</td>
                    <td style="color: #ffffff; border-right: 0;">{{
                        this.methanolIndexData.phaseOneMethanolDayValue
                      }}
                    </td>
                    <td style="color: #ffffff; border-right: 0;">{{
                        this.methanolIndexData.phaseOneMethanolMonthValue
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; font-weight: bold">甲醇二期</td>
                    <td style="color: #ffffff; border-right: 0;">{{
                        this.methanolIndexData.phaseTwoMethanolDayValue
                      }}
                    </td>
                    <td style="color: #ffffff; border-right: 0;">{{
                        this.methanolIndexData.phaseTwoMethanolMonthValue
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td style="border-left: 0; border-bottom: 0; font-weight: bold">甲醇三期</td>
                    <td style="color: #ffffff; border-bottom: 0; border-right: 0;">
                      {{ this.methanolIndexData.phaseThreeMethanolDayValue }}
                    </td>
                    <td style="color: #ffffff; border-bottom: 0; border-right: 0;">
                      {{ this.methanolIndexData.phaseThreeMethanolMonthValue }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 3.1%; margin-top: 12.5%; opacity:0.85"/>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 18.5%;height: 21%; float: left;margin-top: -25%;margin-left: 114%; "></div>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 5%; margin-top: 25%; opacity:0.85"/>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-bottom: 0.15vw dotted #ffffff; width: 5%; height: 5%; float: left; position: absolute; margin-top: 26%; margin-left: 22.9%"></div>

            <!-- 五个柱状图框 -->
            <div style="width: 120%; height: 40%;  float: left; margin-left: -120%; margin-top: 80%">
              <div
                style="width: 100%;height: 85%; background-color: #25a4ff; background-color:rgba(37,164,255,0.7); border: 0.2vw solid #a5e8ff; border-radius:0.4vw">
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.tar }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    焦油
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.crudeBenzene }}
                  </div>
                  <img src="../assets/images/编组 16.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    粗苯
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.ammoniumSulfate }}
                  </div>
                  <img src="../assets/images/编组 3.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫铵
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.sulfur }}
                  </div>
                  <img src="../assets/images/编组 3备份 23.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫磺
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.ammonia }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    氨水
                  </div>
                </div>
              </div>
            </div>

          </div>


          <!-- -->
        </div>

        <!-- 第三行弹框 -->
        <div style="height: 25%;width:100%; float: left;">

          <!-- 焦仓 -->
          <div id="div_3_1" style="display: none; width: 15%;height: 210%; margin-top: 6%; margin-left: 0%">
            <!-- 表格数据 -->
            <div style="width: 100%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 100%;height: 22%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  焦仓库存情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:14%;margin-left: 8%; height: 20%; width: 80%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_3_1_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">焦炭</th>
                    <th style="border-top: 0;">焦粒</th>
                    <th style="border-top: 0; border-right: 0;">焦粉</th>
                  </tr>
                  <tr v-for="(item,key) in cokeSiteInventoryIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{ item.regionName }}</td>
                    <td style="color: #ffffff">{{ item.cokeInventory }}</td>
                    <td style="color: #ffffff">{{ item.cokeParticle }}</td>
                    <td style="color: #ffffff; border-right: 0">{{ item.cokePowder }}</td>
                  </tr>

                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: 4.3%; margin-top:-3%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 80%;height: 10%; float: left;margin-top: -112%;margin-left: 60%; "></div>
          </div>

          <!-- 炼焦炉 -->
          <div id="div_3_2" style="display: none; width: 45%;height: 210%; margin-top: 6%; margin-left: 15%; ">
            <!-- 表格数据 -->
            <div style="width: 110%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 110%;height: 22%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word" style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  焦炉生产情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; position: absolute;height: 6%"/>
                <img src="../assets/images/分割条.png" style="float: left; margin-top:3.5%;margin-left: 2.5%; height: 25%; width: 30%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div style="width: 110%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 1%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_3_2_table" border="0" style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">计划出炉</th>
                    <th style="border-top: 0;">实际出炉</th>
                    <th style="border-top: 0;">煤焦比</th>
                    <th style="border-top: 0;">焦油收率</th>
                    <th style="border-top: 0;">粗苯收率</th>
                    <th style="border-top: 0;">硫磺收率</th>
                    <th style="border-top: 0;">硫铵收率</th>
                    <th style="border-top: 0; border-right: 0;">氨水收率</th>
                  </tr>
                  <tr v-for="(item,key) in rawGasProductionData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{item.stoveGroupName}}</td>
                    <td style="color: #ffffff">{{item.planCount}}</td>
                    <td style="color: #ffffff">{{item.actualCount}}</td>
                    <td style="color: #ffffff">{{item.cokeRatio}}</td>
                    <td style="color: #ffffff">{{item.tarYield }}</td>
                    <td style="color: #ffffff">{{item.crudeBenzeneYield}}</td>
                    <td style="color: #ffffff">{{item.sulfurYield}}</td>
                    <td style="color: #ffffff">{{item.sulfurYield}}</td>
                    <td style="color: #ffffff; border-right: 0">{{item.ammoniaYield}}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png" style="position: absolute; float: left; margin-left: -20%; margin-top:-5%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 28.5%; height: 16%; float: left;margin-top: -41.7%;margin-left: 50%; "></div>
          </div>

          <!-- 荒煤气发生量 -->
          <div id="div_3_3" style="display: none; width: 17%;height: 45%; margin-top: -45%; margin-left: 60%; position: absolute;">
            <!-- 表格数据 -->
            <div style="width: 130%; height: 50%;  float: left;margin-left: 12%">
              <!-- 标题 -->
              <div style="width: 120%;height: 22%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word" style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 1%;margin-left: 5%; font-size: 0.85vw">
                  荒煤气发生量
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; height: 100%"/>
                <img src="../assets/images/分割条.png" style="float: left; margin-top:6%; margin-left: 1%; height: 25%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div style="width: 120%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 3%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_3_3_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">当日</th>
                    <th style="border-top: 0; border-right: 0;">月累计</th>
                  </tr>
                  <tr v-for="(item,key) in rawGasIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold"> {{ item.regionName }}</td>
                    <td style="color: #ffffff"> {{ item.dayQuantity }} </td>
                    <td style="color: #ffffff; border-right: 0">{{ item.monthQuantity }} </td>
                  </tr>

                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -163%; margin-top:116%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 30%;height: 52%; float: left;margin-top: -30%;margin-left: -19.5%; "></div>
          </div>

          <!-- 化产装置-->
          <div id="div_3_4"
               style="display: none; width: 14%;height: 150%;margin-left: 78%;  float: left; margin-top: 2%">
            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -9.9%; margin-top: -1%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff; width: 5%;height: 13%; float: left; position: absolute; margin-left: -9.7%;margin-top: -8%"></div>
            <div
              style="border-right: 0.15vw dotted #ffffff; border-bottom: 0.15vw dotted #ffffff; width: 17%;height: 8%; float: left; position: absolute; margin-left: -9.7%;margin-top: -8.5%"></div>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -10.8%; margin-top: 4.2%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff; border-top: 0.15vw dotted #ffffff; width: 4%;height: 5.5%; float: left; position: absolute; margin-left: -15%;margin-top: 4.5%"></div>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -1%; margin-top: 1.7%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff; border-bottom: 0.15vw dotted #ffffff; width: 2.7%;height: 5.5%; float: left; position: absolute; margin-left: -0.8%;margin-top: 2.5%"></div>

            <!-- 硫酸、洗油柱体框 -->
            <div style="width: 65%; height: 54%;  float: left; margin-left: -100%; margin-top: -115%">
              <div
                style="width: 100%;height: 75%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7); margin-top: 4%; border: 0.2vw solid #a5e8ff; border-radius:0.35vw ">
                <div style="color: #9ad3ff;  font-size: 0.4vw;  position: absolute; margin-top: 0.5%; margin-left: 1%">
                  {{ this.methanolMaterialIndexData.sulphuric }}
                </div>
                <div style="color: #9ad3ff;  font-size: 0.4vw; position: absolute; margin-top: 0.5%; margin-left: 5.3%">
                  {{ this.methanolMaterialIndexData.washOil }}
                </div>
                <div>
                  <img src="../assets/images/编组 15.png" width="30%" style="margin-left: 10%;margin-top: 15%">
                  <img src="../assets/images/编组 16.png" width="30%" style="margin-left: 20%;margin-top: 8%">
                </div>
                <div
                  style="color: #9ad3ff; margin-left: 15%; font-size: 0.4vw; margin-top: 0%; font-weight: bold; float: left">
                  硫酸
                </div>
                <div
                  style="color: #9ad3ff; margin-right: 15%; font-size: 0.4vw; margin-top: 0%; font-weight: bold; float: right">
                  洗油
                </div>
              </div>
            </div>

            <!-- 硫酸、洗油消耗量表格数据 -->
            <div style="width: 120%; height: 60%;  float: left;margin-left: 12%; margin-top: -160%">
              <!-- 标题 -->
              <div style="width: 100%;height: 24%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-left: 1%; font-size: 0.85vw">
                  硫酸、洗油消耗量
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; height: 100%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:10%; margin-left: 1%; height: 30%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_3_4_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">硫酸</th>
                    <th style="border-top: 0; border-right: 0;">洗油</th>
                  </tr>
                  <tr v-for="(item,key) in sulphuricWashIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{ item.regionName }}</td>
                    <td style="color: #ffffff">{{ item.sulphuricValue }}</td>
                    <td style="color: #ffffff; border-right: 0">{{ item.washOilValue }}</td>
                  </tr>

                </table>
              </div>
            </div>

            <!-- 五个柱状图框 -->
            <div style="width: 120%; height: 45%;  float: left;margin-left: -120%; margin-top: 50%">
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.tar }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    焦油
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.crudeBenzene }}
                  </div>
                  <img src="../assets/images/编组 16.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    粗苯
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.ammoniumSulfate }}
                  </div>
                  <img src="../assets/images/编组 3.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫铵
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.sulfur }}
                  </div>
                  <img src="../assets/images/编组 3备份 23.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫磺
                  </div>
                </div>
                <div style="width: 20%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                     {{ this.methanolMaterialIndexData.ammonia }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    氨水
                  </div>
                </div>
              </div>
            </div>

            <!-- 净煤气发生量 -->
            <div style="width: 120%; height: 60%;  float: left;margin-left: 15%; margin-top: -20%">
              <!-- 标题 -->
              <div style="width: 120%;height: 24%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-left: 1%; font-size: 0.85vw">
                  净煤气发生量
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; height: 100%"/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:9%; margin-left: 1%; height: 30%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 120%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_3_4_2_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0;">当日</th>
                    <th style="border-top: 0; border-right: 0;">月累计</th>
                  </tr>
                  <tr v-for="(item,key) in chemicalCleanGasIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{ item.regionName }}</td>
                    <td style="color: #ffffff">{{item.dayQuantity}}</td>
                    <td style="color: #ffffff; border-right: 0">{{ item.monthQuantity }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

        </div>

        <!-- 第四行弹框 -->
        <div style="height: 25%;width:100%; float: left;">
          <!-- 焦炭出厂情况 -->
          <div id="div_4_1" style="display: none; width: 17%;height: 175%; margin-top: -9%; margin-left: 65%;">
            <!-- 表格数据 -->
            <div style="width: 100%; height: 50%;  float: left;margin-left: 0%; margin-top: 30%">
              <!-- 标题 -->
              <div style="width: 100%;height: 32%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  焦炭出厂情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; "/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:13%;margin-left: 1%; height: 25%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 2%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_4_1_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0; border-right: 0;">焦炭</th>
                    <th style="border-top: 0; border-right: 0;">焦粒</th>
                    <th style="border-top: 0; border-right: 0;">焦粉</th>
                  </tr>
                  <tr v-for="(item,key) in cokeFactorIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{ item.inOutType }}</td>
                    <td style="color: #ffffff; border-right: 0;">{{ item.cokeInventory }}</td>
                    <td style="color: #ffffff; border-right: 0;">{{ item.cokeParticle }}</td>
                    <td style="color: #ffffff; border-right: 0;">{{ item.cokePowder }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -25%; margin-top: 8.5%; opacity:0.85"/>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -33%; margin-top: 13%; opacity:0.85"/>
            <div
              style="border-top: 0.15vw dotted #ffffff; width: 44%;height: 10%; float: left;margin-top: 51.5%;margin-left: -145.5%; "></div>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-bottom: 0.15vw dotted #ffffff; width: 60%;height: 18.5%; float: left;margin-top: 53%;margin-left: -190%; "></div>
          </div>

          <!-- 化产品出厂情况 -->
          <div id="div_4_2" style="display: none; width: 17%;height: 175%; margin-top: -9%; margin-left: 65%">
            <!-- 甲醇五个柱状图框 -->
            <div style="width: 120%; height: 35%;  float: left; margin-left: -120%; margin-top:0%">
              <div
                style="width: 80%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw; float: right ">
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.tar }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    焦油
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.crudeBenzene }}
                  </div>
                  <img src="../assets/images/编组 16.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    粗苯
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.ammoniumSulfate}}
                  </div>
                  <img src="../assets/images/编组 3.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫铵
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.sulfur}}
                  </div>
                  <img src="../assets/images/编组 3备份 23.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    硫磺
                  </div>
                </div>
              </div>
            </div>

            <!-- 化产五个柱状图框 -->
            <div style="width: 120%; height: 35%;  float: left;margin-left: -120%; margin-top: 60%">
              <div
                style="width: 80%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 4%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw; float: right ">
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.methanol }}
                  </div>
                  <img src="../assets/images/编组 15.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    甲醇
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.liquidOxygen }}
                  </div>
                  <img src="../assets/images/编组 16.png" style="margin-left: 10%;">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: -5%; font-weight: bold; float: left">
                    液氧
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.liquiNitrogen }}
                  </div>
                  <img src="../assets/images/编组 3.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    液氮
                  </div>
                </div>
                <div style="width: 25%; float: left">
                  <div style="color: #9ad3ff;  font-size: 0.4vw;  margin-top: 0.5%; margin-left: 15%; margin-top: 8%">
                    {{ this.methanolMaterialIndexData.ammonia }}
                  </div>
                  <img src="../assets/images/编组 3备份 23.png" style="margin-left: 5%;margin-top: 15%">
                  <div
                    style="color: #9ad3ff; margin-left: 18%; font-size: 0.4vw; margin-top: 2%; font-weight: bold; float: left">
                    氨水
                  </div>
                </div>
              </div>
            </div>

            <!-- 表格数据 -->
            <div style="width: 100%; height: 100%;  float: left;margin-left: 90%; margin-top: -20%">
              <!-- 标题 -->
              <div style="width: 100%;height: 13%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);">
                <div class="word"
                     style="color: #ffffff;font-weight: normal;float: left;z-index: 0; position: absolute; margin-top: 0.2%;margin-left: 1%; font-size: 0.85vw">
                  化产品出厂情况
                </div>
                <img src="../assets/images/左边框.png" style="float: left;z-index: 1; "/>
                <img src="../assets/images/分割条.png"
                     style="float: left; margin-top:12%;margin-left: 1%; height: 25%; width: 60%"/>
                <img src="../assets/images/右边框.png" style="float: right; height: 100%"/>
              </div>
              <div
                style="width: 100%;height: 85%;background-color: #25a4ff; background-color:rgba(37,164,255,0.7);margin-top: 2%; border: 0.2vw solid #a5e8ff;border-radius:0.4vw ">
                <table id="div_4_2_table" border="0"
                       style="vertical-align:middle; text-align:center;border-spacing: 0; font-size: 0.3vmin; color: #aae6ff; width: 100%;height: 100%">
                  <tr>
                    <th style="border-left: 0;border-top: 0"></th>
                    <th style="border-top: 0; border-right: 0;">当日</th>
                    <th style="border-top: 0; border-right: 0;">月累计</th>
                  </tr>
                  <tr v-for="(item,key) in chemicalProductsIndexData" :key="key">
                    <td style="border-left: 0; font-weight: bold">{{ item.materialName }}</td>
                    <td style="color: #ffffff; border-right: 0;">{{ item.balanceQuantity }}</td>
                    <td style="color: #ffffff; border-right: 0;">{{ item.monthBalanceQuantity }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- 虚线框 -->
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -20.5%; margin-top: 15.5%; opacity:0.85"/>
            <img src="../assets/images/圆点.png"
                 style="position: absolute; float: left; margin-left: -24.5%; margin-top: 15.5%; opacity:0.85"/>
            <div
              style="border-left: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 18%;height: 45%; float: left;margin-top: -90%;margin-left: 71%; "></div>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 18%;height: 27%; float: left;margin-top: -65%;margin-left: 30%; "></div>
            <div
              style="border-right: 0.15vw dotted #ffffff;border-bottom: 0.15vw dotted #ffffff;border-top: 0.15vw dotted #ffffff; width: 27.5%;height: 40%; float: left;margin-top: -95%;margin-left: 1%; "></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  getChemicalCleanGas,
  getCokePushAndActualIndexData,
  getRawGasIndexData,
  getStoveOtherIndexData,
  getSulphuricWashIndexData,
  selectAmmonialIndexData,
  selectChemicalProductsIndexData,
  selectCoalHeapIndexData,
  selectCoalInWarehouseIndexData,
  selectCoalTowerMeasureIndexData,
  selectCokeFactoryIndexData,
  selectCokeProductionIndexData,
  selectCokeSiteInventoryIndexData,
  selectMethanolIndexData,
  selectMethanolMaterialIndexData,
  selectSingleWareHouseIndexData
} from "@/api";
import {listSingleWarehouseMeasure} from "@/api/coking/singleWarehouseMeasure";

export default {
  components: {},
  data() {
    return {
      phaseTwoCoalAreaId: '721039041986573',//二期配煤id
      phaseFourCoalAreaId: '721039041986574',//四期配煤id
      shiftId: '721315018571788',//通班id
      tableData: [{
        date: '火车',
        name: '8300.25',
        address: '54'
      },],

      coalHeapData: {
        phaseTwoValue: '0',//二期煤场库存
        phaseFourValue: '0',//四期煤场库存
        totalSum: '0'//合计
      },
      coalInwareHouseData: {
        transPhaseTwoValue: '0',//火运二期
        transPhaseFourValue: '0',//火运四期
        carPhaseTwoValue: '0',//汽运二期
        carPhaseFourValue: '0',//汽运四期
        carAndTransTwoSumValue: '0',//火运汽运二期煤场
        carAndTransFourSumValue: '0'//火运汽运四期煤场
      },
      singleWarehouseData: {
        phaseTwoCoalUpValue: '0',//二期配煤上煤量
        phaseFourCoalUpValue: '0',//四期配煤上煤量
        phaseTwoCoalConsumeValue: '0',//二期配煤消耗量
        phaseFourCoalConsumeValue: '0',//四期配煤消耗量
        phaseTwoCoalStockValue: '0',//二期配煤库存量
        phaseFourCoalStockValue: '0'//四期配煤库存量
      },
      coalTowerIndexData: {
        phaseTwoCoalTowerValue: '0',//二期煤塔库存
        phaseThreeCoalTowerValue: '0',//三期煤塔库存
        phaseFourCoalTowerValue: '0',//四期煤塔库存
        phaseFiveCoalTowerValue: '0'//五期煤塔库存
      },
      cokeProductionIndexData: {
        phaseTwoCokeDayValue: '0',//二期日数据
        phaseThreeCokeDayValue: '0',//三期日数据
        phaseFourCokeDayValue: '0',//四期日数据
        phaseFiveCokeDayValue: '0',//五期日数据
        phaseTwoCokeMonthValue: '0',//二期月数据
        phaseThreeCokeMonthValue: '0',//三期月数据
        phaseFourCokeMonthValue: '0',//四期月数据
        phaseFiveCokeMonthValue: '0'//五期月数据
      },
      cokeSiteInventoryIndexData: [],
      cokeFactorIndexData: [],
      ammonialIndexData: '0',//合成氨装置氨水数据
      methanolMaterialIndexData: {
        ammonia: 0,//氨水
        tar: 0,//焦油
        crudeBenzene: 0,//粗苯
        ammoniumSulfate: 0,//硫铵
        sulfur: 0//硫磺
      },
      methanolIndexData: {
        phaseOneMethanolDayValue: '0',//甲醇一期日数据
        phaseTwoMethanolDayValue: '0',//甲醇二期日数据
        phaseThreeMethanolDayValue: '0',//甲醇三期日数据
        phaseOneMethanolMonthValue: '0',//甲醇一期月数据
        phaseTwoMethanolMonthValue: '0',//甲醇二期月数据
        phaseThreeMethanolMonthValue: '0'//甲醇三期月数据
      },
      chemicalProductsIndexData: [],

      chemicalProductsIndexImageData: {
        tarDayValue: '0',//焦油当日量
        tarMonthValue: '0',//焦油当月量
        crudeBenzeneDayValue: '0',//粗苯当日量
        crudeBenzeneMonthValue: '0',//粗苯当月量
        ammoniumSulfateDayValue: '0',//硫铵当日量
        ammoniumSulfateMonthValue: '0',//硫铵当月量
        sulfurDayValue: '0',//硫磺当日量
        sulfurMonthValue: '0',//硫磺当月量
        methanolDayValue: '0',//甲醇当日量
        methanolMonthValue: '0',//甲醇当月量
        liquidOxygenDayValue: '0',//液氧当日量
        liquidOxygenMonthValue: '0',//液氧当月量
        liquiNitrogenDayValue: '0',//液氮当日量
        liquiNitrogenMonthValue: '0',//液氮当月量
        ammoniaDayValue: '0',//氨水当日量
        ammoniaMonthValue: '0'//氨水当月量
      },
      chemicalCleanGasIndexData:[],//化产装置净煤气发生量
      sulphuricWashIndexData:[],//化产装置硫酸洗油消耗量
      rawGasIndexData:[],//炼焦炉 荒煤气数据
      rawGasProductionData:[
        {stoveGroupName:'4、5#', planCount:0, actualCount:0, cokeRatio:0, tarYield:0, tarYield:0, sulfurYield:0, ammoniumSulfateYield:0, ammoniaYield:0},
        {stoveGroupName:'6、7#', planCount:0, actualCount:0, cokeRatio:0, tarYield:0, tarYield:0, sulfurYield:0, ammoniumSulfateYield:0, ammoniaYield:0},
        {stoveGroupName:'8、9#', planCount:0, actualCount:0, cokeRatio:0, tarYield:0, tarYield:0, sulfurYield:0, ammoniumSulfateYield:0, ammoniaYield:0},
        {stoveGroupName:'10、11#', planCount:0, actualCount:0, cokeRatio:0, tarYield:0, tarYield:0, sulfurYield:0, ammoniumSulfateYield:0, ammoniaYield:0},
      ]//炼焦炉 焦炉生产情况数据

    }
  },
  
  mounted() {

  },
  methods: {
    getFloat(number, n) {
      n = n ? parseInt(n) : 0
      if (n <= 0) {
        return Math.round(number)
      }
      number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n) //四舍五入
      //number = Number(number).toFixed(n); //补足位数
      return number
    },
    div_1_1_none() {
      document.getElementById("div_1_1").style.display = "block"
    },
    div_1_1_block() {
      document.getElementById("div_1_1").style.display = "none"
    },
    div_1_2_none() {
      document.getElementById("div_1_2").style.display = "block"
    },
    div_1_2_block() {
      document.getElementById("div_1_2").style.display = "none"
    },
    div_1_3_none() {
      document.getElementById("div_1_3").style.display = "block"
    },
    div_1_3_block() {
      document.getElementById("div_1_3").style.display = "none"
    },
    div_2_1_none() {
      document.getElementById("div_2_1").style.display = "block"
    },
    div_2_1_block() {
      document.getElementById("div_2_1").style.display = "none"
    },
    div_2_2_none() {
      document.getElementById("div_2_2").style.display = "block"
    },
    div_2_2_block() {
      document.getElementById("div_2_2").style.display = "none"
    },
    div_2_3_none() {
      document.getElementById("div_2_3").style.display = "block"
    },
    div_2_3_block() {
      document.getElementById("div_2_3").style.display = "none"
    },
    div_2_4_none() {
      document.getElementById("div_2_4").style.display = "block"
    },
    div_2_4_block() {
      document.getElementById("div_2_4").style.display = "none"
    },
    div_3_1_none() {
      document.getElementById("div_3_1").style.display = "block"
    },
    div_3_1_block() {
      document.getElementById("div_3_1").style.display = "none"
    },
    div_3_2_none() {
      document.getElementById("div_3_2").style.display = "block"
      document.getElementById("div_3_3").style.display = "block"
    },
    div_3_2_block() {
      document.getElementById("div_3_2").style.display = "none"
      document.getElementById("div_3_3").style.display = "none"
    },

    div_3_4_none() {
      document.getElementById("div_3_4").style.display = "block"
    },
    div_3_4_block() {
      document.getElementById("div_3_4").style.display = "none"
    },
    div_4_1_none() {
      document.getElementById("div_4_1").style.display = "block"
    },
    div_4_1_block() {
      document.getElementById("div_4_1").style.display = "none"
    },
    div_4_2_none() {
      document.getElementById("div_4_2").style.display = "block"
    },
    div_4_2_block() {
      document.getElementById("div_4_2").style.display = "none"
    },
  }
}
</script>

<style>
#main_div {
  background: url('../assets/images/index_img2.png') repeat-x;
  background-size: 100% 100%
}

.dot {
  position: absolute;
  margin-top: 2%;
  margin-left: 7%;
  width: 0.35vw;
  height: 0.35vw;
  border-radius: 100%;
  background: #ffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
}

#div_1_1_table th, #div_1_2_table th, #div_2_1_table th, #div_2_2_table th, #div_2_3_table th, #div_2_4_table th, #div_3_1_table th,
#div_3_3_table th, #div_3_4_table th, #div_3_4_2_table th, #div_4_2_table th {
  border: 1px solid #aae6ff;
  width: 33%;
}

#div_1_1_table td, #div_1_2_table td, #div_2_1_table td, #div_2_2_table td, #div_2_3_table td, #div_2_4_table td, #div_3_1_table td,
#div_3_3_table td, #div_3_4_table td, #div_3_4_2_table td, #div_4_2_table td {
  border: 1px solid #aae6ff;
  width: 33%;
}

#div_3_1_table th, #div_4_1_table th {
  border: 1px solid #aae6ff;
  width: 25%;
}

#div_3_1_table td, #div_4_1_table td {
  border: 1px solid #aae6ff;
  width: 25%;
}

#div_3_2_table th {
  border: 1px solid #aae6ff;
  width: 11%;
}

#div_3_2_table td {
  border: 1px solid #aae6ff;
  width: 11%;
}

</style>
