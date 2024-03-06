import React, { useContext, useEffect, useRef } from "react";
import { stateContext, dispatchContext } from "../../app";
import downloadIcon from "../../../assets/svg/download.svg";
import printIcon from "../../../assets/svg/print.svg";
import { getPercentage } from "../../../utils/commonUtils";
import SearchForm from "../../../components/searchField/SearchForm";
import Tooltip from "../../../components/tooltip/Tooltip";
import { useSearchParams } from "react-router-dom";

const FinalResult = ({ editorID, experimentID }) => {
  const state = useContext(stateContext)[editorID];

  const dispatch = useContext(dispatchContext);
  const { growing_smiles, filters } = state;
  const [searchParams] = useSearchParams();
  const exp_id = searchParams.get(experimentID);
  const componentRef = useRef(null);
  const resultPctRef = useRef(null);
  const resultSelectedRef = useRef(null);
  const resultTotalRef = useRef(null);

  const api_base = import.meta.env.VITE_BASE_API_URL;
  const out_base = import.meta.env.VITE_BASE_OUTPUT_URL;

  let sliders = {
    "mw": {
      ref: useRef(null),
      discrete: false,
    },
    "clogp": {
      ref: useRef(null),
      discrete: false,
    },
    "hbd": {
      ref: useRef(null),
      discrete: true,
    },
    "hba": {
      ref: useRef(null),
      discrete: true,
    },
    "tpsa": {
      ref: useRef(null),
      discrete: false,
    },
    "fsp3": {
      ref: useRef(null),
      discrete: false,
    },
  };

  const continuous_fmt = wNumb({ decimals: 1 });
  const discrete_fmt = wNumb({ decimals: 0 });

  const do_update = async () => {
    let res;

    let failed = false;

    try {
      let filters = Object.fromEntries(
        Object.entries(sliders)
          .map(([name, entry]) => [
            name,
            entry.discrete ? [ entry.min | 0, entry.max | 0 ] : [ +entry.min, +entry.max ]
          ]));

      let rq = await fetch(`${api_base}/Callscript_pp_filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: exp_id,
          filters: filters,
        }),
      });

      dispatch({
        type: "set_filters",
        instance: editorID,
        data: filters,
      });

      res = await rq.json();
    } catch (e) {
      console.error(e);
      failed = true;
    }

    if (!failed && res.status === 'error')
    {
      console.error(res.data.reason);
      failed = true;
    }

    let selected = 0;
    let total = 0;

    if (!failed) {
      selected = res.data.selected;
      total = res.data.total;
    }

    let selected_pct = total === 0 ? 0 : selected * 100 / total;

    resultSelectedRef.current.innerText = discrete_fmt.to(selected);
    resultTotalRef.current.innerText = discrete_fmt.to(total);
    resultPctRef.current.innerText = continuous_fmt.to(selected_pct);
  };

  const update_delay_ms = 250;
  let ts_next_update = 0;

  useEffect(() => {
    Object.entries(sliders).map(async ([slider_name, slider]) => {
      let rq = await fetch(`${out_base}/${exp_id}/plot-${slider_name}.svg.json`);
      let res = await rq.json();

      slider.min = +res.min;
      slider.max = +res.max;

      let opts = {
        start: [slider.min, slider.max],
        connect: true,
        range: {
          min: slider.min,
          max: slider.max,
        },
        tooltips: [continuous_fmt, continuous_fmt],
        margin: 0,
        pips: {
          mode: 'count',
          values: 5,
          density: 5,
          stepped: false,
          format: continuous_fmt,
        },
      };

      if (slider.discrete) {
        let value_cnt = slider.max - slider.min;
        let padding_pct = 0.5 * 100 / (value_cnt + 1);

        opts.range = {
          min: [slider.min - 0.5, 0.5],
          max: [slider.max + 0.5, 0.5],
        };
        opts.range[`${padding_pct}`] = [slider.min, 1];
        opts.range[`${100 - padding_pct}`] = [slider.max, 1];
        opts.tooltips = [discrete_fmt, discrete_fmt];
        opts.padding = [0.5, 0.5];
        opts.pips = {
          mode: 'values',
          values: [slider.min, slider.min + (value_cnt / 2) | 0, slider.max],
          density: 100 / value_cnt,
          format: discrete_fmt,
          filter: (value, type) => {
            if (value < slider.min || value > slider.max)
              return -1;
            return type;
          },
        }
      }

      let filter = filters[slider_name];
      if (filter) {
        opts.start[0] = filter[0];
        opts.start[1] = filter[1];
      }

      noUiSlider.create(slider.ref.current, opts);

      slider.ref.current.noUiSlider.on('update', (values, handle) => {
        values = slider.ref.current.noUiSlider.get(true); // Retrieve *numeric* values
        slider.min = values[0];
        slider.max = values[1];

        let ts_now = Date.now();
        if (ts_next_update > ts_now)
          return;

        let ts_prev_update = ts_next_update;
        let delay_since_prev = ts_now - ts_prev_update;
        let delay_till_next = Math.max(0, update_delay_ms - delay_since_prev);

        window.setTimeout(() => do_update(), delay_till_next);

        ts_next_update = ts_now + delay_till_next;
      });
    });
  }, []);

  return (<>
    <div className="flex flex-col w-full h-full">

      <div
        className="flex flex-col bg-white shadow-lg w-3/4 rounded-sm border border-l-2 border-slate-200 mx-auto print:h-full overflow-x-hidden overflow-y-auto h-[7rem]"
        ref={componentRef}
      >
        <div className="flex text-lg text-slate-800 font-semibold relative p-4">
          Post processing
        </div>

        <div className="px-4 text-sm">
          On this page, the raw library can be filtered according to common medicinal chemistry descriptors.
        </div>

        <div
          className="text-center text-xl"
        >
          <span className="text-green-600 font-bold" ref={resultSelectedRef}></span>/<span ref={resultTotalRef}></span> (<span className="text-green-600 font-bold"><span ref={resultPctRef}></span>%</span>) products selected.
        </div>
      </div>

      <div
        className="bg-white shadow-lg w-3/4 rounded-sm border border-l-2 border-slate-200 mx-auto text-center text-xl overflow-y-auto h-[calc(100vh-24rem)]"
      >
        <div className="mx-4 flex flex-row flex-wrap items-center h-full">

          {Object.entries(sliders).map(([slider_name, slider]) => (<>
            <div className="chemodots-pp-filter mx-auto my-4 text-sm min-w-[300px] w-[300px]">
              <img src={`${out_base}/${exp_id}/plot-${slider_name}.svg`} width="300" height="300" />
              <div ref={slider.ref}></div>
            </div>
          </>))}

        </div>
      </div>

    </div>
  </>);
};

export default FinalResult;
