import { useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "./Label.tsx";
import Input from "./input/InputField.tsx";
import Select from "./Select.tsx";
import {TimeIcon } from "../../icons/index.ts";
import DatePicker from "./date-picker.tsx";
import TextArea from "./input/TextArea.tsx";


export default function Klasifikasi() {
  const gender = [
    { value: "laki-laki", label: "Laki-Laki" },
    { value: "perempuan", label: "Perempuan" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  const [message, setMessage] = useState("");

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <Label htmlFor="input">Nama</Label>
          <Input type="text" id="input" />
        </div>
        <div>
          <Label>Jenis Kelamin</Label>
          <Select
            options={gender}
            placeholder="Pilih Jenis Kelamin"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker"
            label="Tanggal"
            placeholder="Tanggal Kejadian"
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>
        <div>
          <Label htmlFor="tm">Waktu</Label>
          <div className="relative">
            <Input
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          </div>
              <div>
                <Label>Kronologi</Label>
                <TextArea
                  value={message}
                  onChange={(value) => setMessage(value)}
                  rows={6}
                  placeholder="Tulis kronologi kejadian di sini..."
                />
          </div>
      </div>
    </ComponentCard>
  );
}
