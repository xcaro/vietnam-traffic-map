const jamMarker = require('../../static/marker/jam.jpg')
const jamMarkerConfirmed = require('../../static/marker/jam_confirmed.jpg')

const floodMarker = require('../../static/marker/flood.jpg')
const floodMarkerrConfirmed = require('../../static/marker/flood_confirmed.jpg')

const accidentMarker = require('../../static/marker/accident.jpg')
const accidentMarkerConfirmed = require('../../static/marker/accident_confirmed.jpg')

export const trafficMakerIcons = [
  jamMarker,
  jamMarkerConfirmed,
  floodMarker,
  floodMarkerrConfirmed,
  accidentMarker,
  accidentMarkerConfirmed
]

export function createInfoWindowHTML (trafficReport) {
  return `<div class = "infowindow">
  <div>Mô tả: ` + (trafficReport.comment || 'Không có') + `</div>
  <div>Thời gian: ` + trafficReport.time + `</div>
  <div>Trạng thái :` + (trafficReport.confirm ? 'Đã duyệt' : 'Chưa duyệt') + `</div>` +
    (trafficReport.image ? '<image class = "m-2 mt-3 mr-0" src = "' + trafficReport.image + '">' : '') +
    `<div class = "m-1 mt-2 d-flex justify-content-center">
      ` +
      (
        trafficReport.confirm
          ? `<button class = "btn btn-primary mr-2" onclick="unconfirmReport(${trafficReport.id})">
          <span class="icon-thumb-down d-inline">
          </span>
          Hủy xác nhận
        </button>`
          : `<button class = "btn btn-primary mr-2" onclick="confirmReport(${trafficReport.id})">
          <span class="icon-thumbs-up d-inline">
          </span>
          Xác nhận
      </button>`
      ) +
      `<button class = "btn btn-danger ml-1" onclick="console.log(this)">
        <span class="icon-trash d-inline">
        </span>
        Đã kết thúc
      </button>
    </div>` +
`</div>`
}
