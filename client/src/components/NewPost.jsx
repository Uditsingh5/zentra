import React, { useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { AddSquareIcon } from '@hugeicons/core-free-icons';


const NewPost = ({ PostBoxClose }) => {
    return (
        <div
            id="post-bg"
            className="absolute w-full h-full bg-[#000000b7] z-4 text-gray-900"
            onClick={PostBoxClose}
        >
            <div
                className="w-[48%] rounded-3xl bg-[#eeeeee] absolute top-[50%] translate-x-[-50%] translate-y-[-50%] left-[50%] transition-all duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className=" flex gap-5 p-[2em]  items-start justify-start">
                    <div className="w-[4em] h-[4em] aspect-square rounded-2xl bg-white">
                    
                    </div>
                    <div className=" flex flex-col gap-2 w-[100%]">
                        <div> @UditSingh_005</div>
                        <textarea type="text" name="content" className="p-1.5 w-[100%]  resize-y rounded-md max-h-[16em] border-1 border-[#2a2a2a]" placeholder="What's on your mind?" />
                       
                    </div>
                </div>
            <div className="flex w-[100%] gap-5 p-[2em] justify-between">
            <p>are comments allowed?</p>
            <button>Post</button>
            </div>
            </div>
        </div>
    );
};

export default NewPost;
