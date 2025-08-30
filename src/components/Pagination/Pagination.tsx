import React, { FC, ReactNode } from "react";

import classNames from "classnames";

import prev from "./assets/prev.svg";
import next from "./assets/next.svg";

import "./Pagination.less";

/** ## Pagination behaviour:
 *   Previous 	1   [2]   3   ...   12    Next                Showing 11 - 20 of 118
 *   Previous   1   ...   3   [4]   5   ...   12   Next       Showing 11 - 20 of 118
 */

interface PaginationProps {
  pages: number;
  current: number;
  total: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  children?: ReactNode;
}

const Pagination: FC<PaginationProps> = ({
  pages,
  current,
  total,
  pageSize = 10,
  onPageChange,
  children
}) => {
  // build page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (current > 3) pageNumbers.push("...");
      const start = Math.max(2, current - 1);
      const end = Math.min(pages - 1, current + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (current < pages - 2) pageNumbers.push("...");
      pageNumbers.push(pages);
    }

    return pageNumbers;
  };

  const startIndex = (current - 1) * pageSize + 1;
  const endIndex = Math.min(current * pageSize, total);

  return (
    <div className="Pagination">
      {children && <div className="Pagination-container">{children}</div>}

      <div className="Pagination-footer noselect">
        <div className="Pagination-paging">
          <div
            className={classNames("prev", { disabled: current === 1 })}
            onClick={() => onPageChange?.(current - 1)}
          >
            <img src={prev} alt="prev" />
            Previous
          </div>

          {getPageNumbers().map((page, idx) =>
            typeof page === "number" ? (
              <div
                key={idx}
                className={classNames("number", { active: page === current })}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </div>
            ) : (
              <span key={idx} className="ellipsis">
                {page}
              </span>
            )
          )}

          <div
            className={classNames("next", { disabled: current === pages })}
            onClick={() => onPageChange?.(current + 1)}
          >
            Next
            <img src={next} alt="next" />
          </div>
        </div>

        <div className="Pagination-info">
          Showing {startIndex} - {endIndex} of {total}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
