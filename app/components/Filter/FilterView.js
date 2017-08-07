/*  Copyright (c) 2017 IBM Corp.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

import React from "react";
import SectionHeading from "../Heading/SectionHeading";
import MultiSelect from "../Form/Select/MultiSelect";
import { getList } from "../../utils/filter";
import Button from "../Button/Button";

const FilterView = props => {
  return (
    <div>
      <div
        className={`filter-container`}
        style={{ visibility: `${props.isFixed ? "hidden" : "visible"}` }}
      >
        <SectionHeading>Selection</SectionHeading>
        <FilterViewContent {...props} />
      </div>

      <div
        className={`filter-container fixed`}
        style={{ visibility: `${props.isFixed ? "visible" : "hidden"}` }}
      >
        <FilterViewContent {...props} />
      </div>
    </div>
  );
};

export default FilterView;

const FilterViewContent = ({
  filter,
  onSelection,
  hunks,
  onSelectionSubmit
}) => {
  let filenames = getList("fileName", hunks);
  let cves = getList("cve", hunks);
  let providers = getList("provider", hunks);

  return (
    <div className="filter-content">
      <div className="filter-selection">
        <MultiSelect
          name="Filename"
          data={filenames}
          value={filter.fileName}
          handleSelectionChange={value => onSelection("fileName", value)}
        />

        <MultiSelect
          name="CVE"
          data={cves}
          value={filter.cve}
          handleSelectionChange={value => onSelection("cve", value)}
        />

        <MultiSelect
          name="Provider"
          data={providers}
          value={filter.provider}
          handleSelectionChange={value => onSelection("provider", value)}
        />

        <Button
          className="process"
          onClick={onSelectionSubmit}
          name="Process"
        />
      </div>
    </div>
  );
};
